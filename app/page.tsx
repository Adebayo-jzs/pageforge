"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "An AI tool that writes cold emails for B2B sales teams",
  "A Notion-like app built for remote engineering teams",
  "A SaaS platform that automates invoicing for freelancers",
  "A mobile app that tracks your carbon footprint daily",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // Pass prompt via URL search params to /new
    const params = new URLSearchParams({ prompt });
    router.push(`/new?${params.toString()}`);
  };

  return (
    
    <main className="flex flex-col items-center justify-center min-h-screen py-30 bg-neutral-950 text-neutral-100 px-6">
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

      {/* Projects Gallery */}
      {projects.length > 0 && (
        <div className="mt-24 w-full max-w-5xl pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-xs text-neutral-500">{projects.length} generated</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <Link 
                key={p._id} 
                href={`/p/${p._id}`}
                className="group flex flex-col justify-between bg-neutral-900 border border-neutral-800 
                           rounded-xl p-5 hover:border-neutral-700 hover:bg-neutral-800/50 
                           transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                      {p.provider || "gemini"}
                    </span>
                    <span className="text-[10px] text-neutral-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                    {p.prompt}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-800/50 flex items-center justify-between">
                  <span className="text-xs font-medium text-yellow-300/80 group-hover:text-yellow-300 transition-colors">
                    View Project
                  </span>
                  <span className="text-neutral-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
