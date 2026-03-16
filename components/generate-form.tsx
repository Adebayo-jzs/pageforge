"use client";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, MoveRight } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "An AI tool that writes cold emails for B2B sales teams",
  "A Notion-like app built for remote engineering teams",
  "A SaaS platform that automates invoicing for freelancers",
  "A mobile app that tracks your carbon footprint daily",
];

const PLACEHOLDERS = [
  "Describe your product or website...",
  "A modern dashboard for crypto...",
  "A travel blog with dark mode...",
  "An e-commerce site for shoes...",
  "A fitness app tracking real-time stats...",
  "A portfolio for a digital artist..."
];

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Typing animation for placeholder
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentFullText = PLACEHOLDERS[placeholderIndex];
      
      if (!isDeleting) {
        setDisplayText(currentFullText.slice(0, displayText.length + 1));
        
        if (displayText.length === currentFullText.length) {
          timeout = setTimeout(() => setIsDeleting(true), 2000); // Wait before deleting
        } else {
          timeout = setTimeout(type, 100); // Speed of typing
        }
      } else {
        setDisplayText(currentFullText.slice(0, displayText.length - 1));
        
        if (displayText.length === 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
          timeout = setTimeout(type, 500); // Wait before typing next
        } else {
          timeout = setTimeout(type, 50); // Speed of deleting
        }
      }
    };

    timeout = setTimeout(type, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, placeholderIndex]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    const params = new URLSearchParams({ prompt });
    router.push(`/new?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-dmsans animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
      {/* Outer wrapper */}
      <div className="flex items-center justify-center w-full mb-8">
        <div className="flex-1 bg-white border border-landing-border rounded-[2.5rem] shadow-landing-xl focus-within:border-landing-accent/50 transition-all duration-300 relative">
          <textarea
            className="w-full bg-transparent text-[1.05rem] text-landing-ink resize-none outline-none
                      px-6 pt-5 pb-2   min-h-[120px] font-medium relative z-10"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your product"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          
          {/* Typing Placeholder Overlay */}
          {/* {!prompt && (
            <div className="absolute top-[33px] left-[36px] pointer-events-none text-[1.05rem] font-medium text-landing-ink-faint">
              {displayText}
              <span className="inline-block w-[2px] h-[1.1rem] bg-landing-accent ml-0.5 animate-pulse align-middle relative -top-[1px]" />
            </div>
          )} */}

          <div className="flex items-center justify-between px-6 pb-2">
            <span className="text-[0.8rem] text-landing-ink-faint font-medium">
              {prompt.length > 0 ? `${prompt.length} characters` : "⌘ + Enter to submit"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="bg-landing-accent text-white font-bold text-sm px-5 py-2.5 rounded-full
                         disabled:opacity-20 disabled:cursor-not-allowed
                         hover:bg-landing-accent/90 active:scale-[0.97]
                         transition-all cursor-pointer shadow-landing-sm hover:shadow-landing-md"
            >
              <HugeiconsIcon icon={ArrowRight02Icon} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Examples chips */}
      {/* <div className="flex flex-col items-center gap-3">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => setPrompt(ex)}
              className="text-[0.75rem] text-landing-ink-muted border border-landing-border rounded-full
                         px-4 py-2 hover:border-landing-accent hover:text-landing-accent
                         bg-white/50 backdrop-blur-sm transition-all cursor-pointer font-medium"
          >
            {ex}
          </button>
        ))}
      </div> */}
      
      <p className="mt-12 text-landing-ink-faint text-[0.85rem] font-[350]">
        Describe your landing page idea and let PageForge build it.
      </p>
    </div>
  );
}
