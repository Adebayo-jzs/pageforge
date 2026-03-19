import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

const SYSTEM_PROMPT = `
You are a product management assistant for "PageForge", an AI landing page generator.
Given a raw user prompt describing a product, SaaS, or local business, your job is to identify 4 to 6 pieces of information (business details, contact info, social links, feature highlights, etc.) that would be highly useful to ask the user for before generating their landing page.

RETURN ONLY VALID JSON. The JSON must be an array of objects.
Each object must have exactly these keys:
- "id": a unique camelCase string (e.g., "businessName", "githubUrl", "primaryFeature")
- "label": a short, human-readable label (e.g., "Business Name", "GitHub URL", "Primary Feature")
- "placeholder": a helpful placeholder example (e.g., "Acme Corp", "https://github.com/...", "AI-powered autocomplete")

Example output for a "local coffee shop":
[
  { "id": "shopName", "label": "Shop Name", "placeholder": "Brews & Co." },
  { "id": "address", "label": "Address", "placeholder": "123 Main St, City" },
  { "id": "openingHours", "label": "Opening Hours", "placeholder": "Mon-Fri 7am-5pm" },
  { "id": "instagram", "label": "Instagram Handle", "placeholder": "@brewsandco" }
]

Do NOT use markdown markdown blocks like \`\`\`json. Return strictly the raw JSON array string.
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check session
    const session = await auth();
    const userId = session?.user?.id;
    const userPlan = session?.user?.plan;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting for free plan
    if (userPlan === "free") {
      await dbConnect();
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCount = await Project.countDocuments({
        userId,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      if (recentCount >= 1) {
        return NextResponse.json(
          { error: "Free plan limit reached: 1 site per day. Upgrade to Pro for unlimited sites." },
          { status: 429 }
        );
      }
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Prompt: ${prompt}` }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { 
            temperature: 0.1,
            responseMimeType: "application/json"
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const data = await res.json();
    
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Gemini returned empty content");
    
    // Safety fallback just in case Gemini wraps it in markdown despite instructions
    raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    const fields = JSON.parse(raw);
    return NextResponse.json({ fields });

  } catch (err: any) {
    console.error("Failed to analyze prompt:", err.message);
    // Graceful fallback to default fields if the LLM request fails
    const fallbackFields = [
      { id: "name", label: "Business / Brand Name", placeholder: "Acme Corp" },
      { id: "email", label: "Email Address", placeholder: "hello@acme.com" },
      { id: "website", label: "Website (if any)", placeholder: "https://acme.com" },
      { id: "social", label: "Primary Social Link (Twitter, Insta, etc)", placeholder: "@acmecorp" }
    ];
    return NextResponse.json({ fields: fallbackFields });
  }
}
