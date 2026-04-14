import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";

interface GeneratedPage {
  name: string;
  path: string;
  html: string;
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

async function tryGroq(prompt: string): Promise<GeneratedPage[]> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      max_tokens: 32768,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a multi-page website for: ${prompt}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.choices?.[0]?.finish_reason === "length")
    throw new Error("Groq output truncated");
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Groq returned empty content");
  return extractPages(raw);
}

async function tryOpenAI(prompt: string): Promise<GeneratedPage[]> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 16384,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Create a multi-page website for: ${prompt}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.choices?.[0]?.finish_reason === "length")
    throw new Error("OpenAI output truncated");
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned empty content");
  return extractPages(raw);
}

async function savePage(doc: {
  userId: string;
  prompt: string;
  pages: GeneratedPage[];
  provider: string;
  ip: string;
}) {
  try {
    await dbConnect();
    const result = await Project.create(doc);
    return result._id.toString();
  } catch (err) {
    console.error("MongoDB save failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  console.log("[/api/generate] Request received");

  // Check session first to avoid expensive AI calls for unauthorized users
  const session = await auth();
  const userId = session?.user?.id;
  const userPlan = session?.user?.plan;

  if (!userId) {
    console.warn("[/api/generate] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ratelimiting for free plan users: 1 site per day
  if (userPlan === "free") {
    await dbConnect();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentProjectsCount = await Project.countDocuments({
      userId,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (recentProjectsCount >= 1) {
      return NextResponse.json(
        { 
          error: "Free plan limit reached: 1 site per day. Upgrade to Pro for unlimited sites." 
        }, 
        { status: 429 }
      );
    }
  }

  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  let pages: GeneratedPage[];
  let provider: string;

  try {
    console.log("[/api/generate] Calling Gemini...");
    const geminiStart = Date.now();
    pages = await tryGemini(prompt);
    provider = "gemini";
    console.log(`[/api/generate] Gemini succeeded in ${Date.now() - geminiStart}ms`);
  } catch (geminiErr) {
    console.warn("[/api/generate] Gemini failed, trying Groq:", (geminiErr as Error).message);
    try {
      console.log("[/api/generate] Calling Groq...");
      const groqStart = Date.now();
      pages = await tryGroq(prompt);
      provider = "groq";
      console.log(`[/api/generate] Groq succeeded in ${Date.now() - groqStart}ms`);
    } catch (groqErr) {
      console.warn("[/api/generate] Groq failed, trying OpenAI:", (groqErr as Error).message);
      try {
        console.log("[/api/generate] Calling OpenAI...");
        const openaiStart = Date.now();
        pages = await tryOpenAI(prompt);
        provider = "openai";
        console.log(`[/api/generate] OpenAI succeeded in ${Date.now() - openaiStart}ms`);
      } catch (openaiErr) {
        console.error("[/api/generate] OpenAI also failed:", (openaiErr as Error).message);
        return NextResponse.json(
          { error: "All providers failed. Check your API keys." },
          { status: 502 }
        );
      }
    }
  }

  // Save to MongoDB
  console.log("[/api/generate] Saving to MongoDB...");
  const saveStart = Date.now();
  const id = await savePage({ userId, prompt, pages, provider, ip });
  console.log(`[/api/generate] Saved in ${Date.now() - saveStart}ms`);

  console.log(`[/api/generate] Total duration: ${Date.now() - start}ms`);
  
  // Return the main page html for backwards compatibility with the previewer
  const homeHtml = pages.find(p => p.path === "/" || p.path === "index.html")?.html || pages[0]?.html || "";
  return NextResponse.json({ html: homeHtml, pages, provider, id });
}