import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import clientPromise from "@/lib/mongodb";

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
  if (data.candidates?.[0]?.finishReason === "MAX_TOKENS")
    throw new Error("Gemini output truncated");
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
  if (data.choices?.[0]?.finish_reason === "length")
    throw new Error("OpenAI output truncated");
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned empty content");
  return extractHtml(raw);
}

async function savePage(doc: {
  prompt: string;
  html: string;
  provider: string;
  ip: string;
}) {
  try {
    const client = await clientPromise;
    const db = client.db("pageforge");
    const result = await db.collection("projects").insertOne({
      ...doc,
      createdAt: new Date(),
    });
    return result.insertedId.toString();
  } catch (err) {
    // Don't fail the request if saving fails
    console.error("MongoDB save failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  let html: string;
  let provider: string;

  try {
    html = await tryGemini(prompt);
    provider = "gemini";
  } catch (geminiErr) {
    console.warn("Gemini failed, trying OpenAI:", (geminiErr as Error).message);
    try {
      html = await tryOpenAI(prompt);
      provider = "openai";
    } catch (openaiErr) {
      console.error("OpenAI also failed:", (openaiErr as Error).message);
      return NextResponse.json(
        { error: "All providers failed. Check your API keys." },
        { status: 502 }
      );
    }
  }

  // Save to MongoDB (non-blocking — don't await in the return)
  const id = await savePage({ prompt, html, provider, ip });

  return NextResponse.json({ html, provider, id });
}