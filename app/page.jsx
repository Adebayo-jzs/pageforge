"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "An AI tool that writes cold emails for B2B sales teams",
  "A Notion-like app built for remote engineering teams",
  "A SaaS platform that automates invoicing for freelancers",
  "A mobile app that tracks your carbon footprint daily",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // Pass prompt via URL search params to /new
    const params = new URLSearchParams({ prompt });
    router.push(`/new?${params.toString()}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 px-6">
      {/* Logo + Tagline */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black tracking-tight mb-3">
          Page<span className="text-yellow-300">Forge</span>
        </h1>
        <p className="text-neutral-400 text-lg">
          Describe your product. Get a landing page.
        </p>
      </div>

      {/* Input card */}
      <div className="w-full max-w-2xl">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-1.5 shadow-lg shadow-black/20">
          <textarea
            className="w-full bg-transparent text-sm text-neutral-200 resize-none outline-none
                       p-4 pb-2 placeholder:text-neutral-600 min-h-[80px]"
            placeholder="Describe your product or website..."
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] text-neutral-600">
              {prompt.length > 0 ? `${prompt.length} chars` : "⌘ + Enter to submit"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="bg-yellow-300 text-black font-semibold text-xs px-4 py-2 rounded-xl
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-yellow-200 active:scale-[0.97]
                         transition-all cursor-pointer"
            >
              →
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className="text-xs text-neutral-500 border border-neutral-800 rounded-full
                         px-4 py-2 hover:border-neutral-600 hover:text-neutral-300
                         transition-all cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
