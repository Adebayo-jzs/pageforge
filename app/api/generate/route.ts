import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";

// Strip markdown code fences if model wraps output
function extractHtml(raw: string): string {
  return raw
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function tryGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create a landing page for: ${prompt}` }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { maxOutputTokens: 65536, temperature: 0.8 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();

  // Check for truncation
  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason === "MAX_TOKENS") {
    throw new Error("Gemini output was truncated (MAX_TOKENS)");
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned empty content");
  return extractHtml(raw);
}

async function tryOpenAI(prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 16384,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a landing page for: ${prompt}` },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();

  // Check for truncation
  const finishReason = data.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    throw new Error("OpenAI output was truncated (length limit)");
  }

  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned empty content");
  return extractHtml(raw);
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // Try Gemini first, fall back to OpenAI
  try {
    const html = await tryGemini(prompt);
    return NextResponse.json({ html, provider: "gemini" });
  } catch (geminiErr) {
    console.warn("Gemini failed, trying OpenAI:", (geminiErr as Error).message);
    try {
      const html = await tryOpenAI(prompt);
      return NextResponse.json({ html, provider: "openai" });
    } catch (openaiErr) {
      console.error("OpenAI also failed:", (openaiErr as Error).message);
      return NextResponse.json(
        { error: "All providers failed. Check your API keys." },
        { status: 502 }
      );
    }
  }
}