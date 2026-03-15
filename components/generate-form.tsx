"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, MoveRight } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "An AI tool that writes cold emails for B2B sales teams",
  "A Notion-like app built for remote engineering teams",
  "A SaaS platform that automates invoicing for freelancers",
  "A mobile app that tracks your carbon footprint daily",
];

export default function GenerateForm() {
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
              className="bg-[#e8ff47] text-black font-semibold text-xs px-4 py-2 rounded-xl
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-[#e8ff47]/50 active:scale-[0.97]
                         transition-all cursor-pointer"
            >
              <HugeiconsIcon icon={ArrowRight02Icon} />
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-6 flex flex-wrap justify-center gap-2  w-[100%]  ">
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

       
  );
}
