import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { auth } from "@/lib/auth";

import { analyzePrompt } from "@/lib/ai/analyzer";
import { generateBrand } from "@/lib/ai/brand";
import { planLayout } from "@/lib/ai/planner";
import { composeReactPage } from "@/lib/ai/composer";

interface GeneratedPage {
  name: string;
  path: string;
  html?: string;
  reactCode?: string;
}

function extractPages(raw: string): GeneratedPage[] {
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed.pages || !Array.isArray(parsed.pages)) {
      throw new Error("JSON missing 'pages' array");
    }
    return parsed.pages;
  } catch (err) {
    console.error("Failed to parse LLM JSON:", raw.substring(0, 200));
    throw new Error("Invalid JSON returned by LLM");
  }
}

async function tryGemini(prompt: string): Promise<GeneratedPage[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create a multi-page website for: ${prompt}` }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { 
          maxOutputTokens: 65536, 
          temperature: 0.8,
          responseMimeType: "application/json" 
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.candidates?.[0]?.finishReason === "MAX_TOKENS")
    throw new Error("Gemini output truncated");
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned empty content");
  return extractPages(raw);
}

// Keeping Groq and OpenAI fallback for HTML generation only for simplicity in this example
// You can expand this later if needed.

export async function POST(req: NextRequest) {
  const start = Date.now();
  console.log("[/api/generate] Request received");

  const session = await auth();
  const userId = session?.user?.id;
  const userPlan = session?.user?.plan;

  if (!userId) {
    console.warn("[/api/generate] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let isFreePlan = userPlan === "free";
  
  await dbConnect();
  
  // Verify plan from DB in case they just upgraded
  if (isFreePlan) {
    const dbUser = await User.findById(userId);
    if (dbUser && dbUser.plan === "pro") {
      isFreePlan = false;
    }
  }

  if (isFreePlan) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentProjectsCount = await Project.countDocuments({
      userId,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (recentProjectsCount >= 1) {
      return NextResponse.json(
        { error: "Free plan limit reached: 1 site per day. Upgrade to Pro for unlimited sites." }, 
        { status: 429 }
      );
    }
  }

  const { prompt, type = "html" } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  let pages: GeneratedPage[] = [];
  let provider = "unknown";
  let brandConfig = null;
  let layoutPlan = null;

  let files: Record<string, string> = {};

  try {
    if (type === "react") {
      console.log("[/api/generate] Starting React pipeline...");
      
      console.log("[/api/generate] 1. Analyzing prompt...");
      const analysis = await analyzePrompt(prompt);
      
      console.log("[/api/generate] 2. Generating brand...");
      brandConfig = await generateBrand(analysis);
      
      console.log("[/api/generate] 3. Planning layout...");
      layoutPlan = await planLayout(analysis);
      
      console.log("[/api/generate] 4. Composing React workspace...");
      files = await composeReactPage(layoutPlan, analysis, brandConfig);
      
      provider = "openai-pipeline";
    } else {
      console.log("[/api/generate] Calling Gemini (HTML mode)...");
      pages = await tryGemini(prompt);
      provider = "gemini";
    }
  } catch (err: any) {
    console.error("[/api/generate] Pipeline failed:", err.message);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }

  console.log("[/api/generate] Saving to MongoDB...");
  await dbConnect();
  
  // Format pages for backwards compatibility
  if (type === "react" && layoutPlan) {
    pages = layoutPlan.pages.map((p: any) => ({
      name: p.name,
      path: p.path,
    }));
  }

  // Convert files object to array for MongoDB storage to bypass key restrictions
  let dbFiles: any[] = [];
  if (type === "react" && files) {
    dbFiles = Object.keys(files).map((path) => ({
      path,
      content: files[path],
    }));
  }

  const project = await Project.create({
    userId,
    prompt,
    type,
    pages,
    files: dbFiles,
    provider,
    ip,
    brandConfig,
    layoutPlan,
  });
  
  console.log(`[/api/generate] Total duration: ${Date.now() - start}ms`);
  
  return NextResponse.json({ 
    id: project._id.toString(),
    type,
    pages,
    files,
    brandConfig,
    layoutPlan
  });
}