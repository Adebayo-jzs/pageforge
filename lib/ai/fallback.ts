export async function generateJsonWithFallback(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<any> {
  let lastError: Error | null = null;

  // 1. Try Gemini
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini Error: ${await res.text()}`);
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Gemini returned empty content");
    return JSON.parse(raw);
  } catch (e: any) {
    console.warn("[AI Fallback] Gemini failed:", e.message);
    lastError = e;
  }

  // 2. Try Groq
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
      }),
    });

    if (!res.ok) throw new Error(`Groq Error: ${await res.text()}`);
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (e: any) {
    console.warn("[AI Fallback] Groq failed:", e.message);
    lastError = e;
  }

  // 3. Try OpenAI
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
      }),
    });

    if (!res.ok) throw new Error(`OpenAI Error: ${await res.text()}`);
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (e: any) {
    console.warn("[AI Fallback] OpenAI failed:", e.message);
    lastError = e;
  }

  throw new Error(`All providers failed. Last error: ${lastError?.message}`);
}
