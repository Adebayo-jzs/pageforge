import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const EDIT_SYSTEM_PROMPT = `You are an expert web developer. The user will give you existing HTML/CSS/JS code and an edit instruction.
Your job is to apply the edit instruction to the code and return ONLY the complete, updated HTML.
Rules:
- Return ONLY the raw HTML with no markdown fences, no explanation, no extra text.
- Preserve all existing styles, scripts, and structure unless the edit instruction explicitly says to change them.
- Apply the edit precisely and elegantly.
- The output must be a fully valid, complete HTML document.`;

async function editWithGemini(currentHtml: string, instruction: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Here is the current HTML:\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nEdit instruction: ${instruction}\n\nReturn the complete updated HTML only.`,
              },
            ],
          },
        ],
        systemInstruction: { parts: [{ text: EDIT_SYSTEM_PROMPT }] },
        generationConfig: {
          maxOutputTokens: 65536,
          temperature: 0.6,
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.candidates?.[0]?.finishReason === "MAX_TOKENS")
    throw new Error("Gemini output truncated");
  const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!raw) throw new Error("Gemini returned empty content");

  // Strip markdown fences if model included them anyway
  return raw
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { html, instruction } = await req.json();

  if (!html?.trim()) {
    return NextResponse.json({ error: "HTML is required" }, { status: 400 });
  }
  if (!instruction?.trim()) {
    return NextResponse.json({ error: "Instruction is required" }, { status: 400 });
  }

  try {
    const updatedHtml = await editWithGemini(html, instruction);
    return NextResponse.json({ html: updatedHtml });
  } catch (err: any) {
    console.error("[/api/edit] Error:", err.message);
    return NextResponse.json(
      { error: "Edit failed. Please try again." },
      { status: 500 }
    );
  }
}
