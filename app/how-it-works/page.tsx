"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

/* ─── Mockup components ─────────────────────────────── */

function PromptMockup() {
  const examples = [
    "An AI tool that writes cold emails for B2B sales teams",
    "A Notion-like app for remote engineering teams",
    "SaaS platform that automates invoicing for freelancers",
  ];
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = examples[active];
    if (typing) {
      if (typed.length < target.length) {
        const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 28);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (typed.length > 0) {
        const t = setTimeout(() => setTyped(typed.slice(0, -1)), 12);
        return () => clearTimeout(t);
      } else {
        setActive((a) => (a + 1) % examples.length);
        setTyping(true);
      }
    }
  }, [typed, typing, active]);

  return (
    <div className="bg-white border border-landing-border rounded-xl overflow-hidden font-dmsans shadow-landing-md">
      {/* Browser chrome */}
      <div className="bg-landing-bg border-b border-landing-border p-2.5 px-3.5 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 bg-white rounded-md py-[3px] px-2.5 text-[0.65rem] text-landing-ink-muted border border-landing-border text-center">
          pageforge.ai
        </div>
      </div>

      {/* Content */}
      <div className="p-5 text-left">
        <div className="mb-4">
          <p className="font-instrument text-2xl text-landing-ink tracking-tight leading-none">
            Page<span className="text-landing-accent">Forge</span>
          </p>
          <p className="text-[0.65rem] text-landing-ink-muted mt-1">Describe your product. Get a landing page.</p>
        </div>

        <div className="bg-white border border-landing-border rounded-lg overflow-hidden">
          <div className="p-3 px-3.5 min-h-[64px]">
            <p className="text-[0.7rem] text-landing-ink-muted leading-relaxed">
              {typed}
              <span className="inline-block w-[1.5px] h-3 bg-landing-accent ml-0.5 animate-blink-dot align-middle" />
            </p>
          </div>
          <div className="border-t border-landing-border p-2 px-3.5 flex justify-between items-center">
            <span className="text-[0.6rem] text-landing-ink-faint">⌘ + Enter to submit</span>
            <div className="bg-landing-accent text-white rounded-md px-2.5 py-1 text-[0.65rem] font-medium">→</div>
          </div>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {["B2B SaaS", "Mobile App", "Dev Tool"].map((tag) => (
            <span key={tag} className="text-[0.6rem] text-landing-ink-muted border border-landing-border rounded-full px-2 py-0.5">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeneratingMockup() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const steps = [
    "Analysing product brief...",
    "Crafting headline copy...",
    "Designing layout structure...",
    "Generating feature section...",
    "Polishing styles & animations...",
    "Finalising HTML output...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { return 0; }
        return p + 1.2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStep(Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1));
  }, [progress]);

  return (
    <div className="bg-white border border-landing-border rounded-xl overflow-hidden font-dmsans shadow-landing-md">
      <div className="bg-landing-bg border-b border-landing-border p-2.5 px-3.5 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 bg-white rounded-md py-[3px] px-2.5 text-[0.65rem] text-landing-ink-muted border border-landing-border text-center">
          pageforge.ai/new
        </div>
      </div>

      <div className="p-5 text-left">
        {/* Split view */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Left — status */}
          <div>
            <p className="text-[0.6rem] text-landing-ink-faint mb-2.5 tracking-widest uppercase">Status</p>
            <div className="flex flex-col gap-1.5">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 border flex items-center justify-center transition-all duration-300 ${i <= step ? 'border-landing-accent bg-landing-accent' : 'border-landing-border'}`}>
                    {i < step ? <span className="text-[0.45rem] text-white font-bold">✓</span> : i === step ? <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> : null}
                  </div>
                  <span className={`text-[0.6rem] transition-colors duration-300 ${i < step ? 'text-landing-ink-faint line-through' : i === step ? 'text-landing-ink font-medium' : 'text-landing-ink-muted'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — preview skeleton */}
          <div className="bg-landing-bg border border-landing-border rounded-lg p-2.5 flex flex-col gap-1.5">
            <p className="text-[0.55rem] text-landing-ink-faint tracking-widest uppercase mb-1">Preview</p>
            {/* Skeleton bars */}
            {[100, 70, 85, 50, 90, 60, 75].map((w, i) => (
              <div key={i} className={`h-${i === 0 ? '2' : '1'} rounded-sm bg-landing-ink/5 animate-pulse transition-opacity duration-500`} style={{ width: `${w}%`, animationDelay: `${i * 0.1}s`, opacity: progress > i * 12 ? 1 : 0.2 }} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[0.6rem] text-landing-ink-muted">Generating with pageforge AI</span>
            <span className="text-[0.6rem] text-landing-accent font-semibold">{Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div className="h-[3px] bg-landing-border rounded-full overflow-hidden">
            <div className="h-full bg-landing-accent transition-all duration-100 ease-linear" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMockup() {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className="bg-white border border-landing-border rounded-xl overflow-hidden font-dmsans shadow-landing-md">
      {/* Browser chrome */}
      <div className="bg-landing-bg border-b border-landing-border p-2.5 px-3.5 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 bg-white rounded-md py-[3px] px-2.5 text-[0.65rem] text-landing-ink-muted border border-landing-border text-center">
          your-page.html
        </div>
        <div className="bg-landing-accent text-white text-[0.6rem] font-semibold px-2 py-0.5 rounded-md cursor-pointer">
          ↓ Download
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-landing-border px-3.5">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 px-3 text-[0.65rem] font-medium transition-all border-b-2 font-inherit cursor-pointer ${tab === t ? 'text-landing-accent border-landing-accent' : 'text-landing-ink-muted border-transparent hover:text-landing-ink'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-3.5">
        {tab === "preview" ? (
          <div className="bg-[#fff] border border-landing-border rounded-lg overflow-hidden text-left">
            {/* Mock nav */}
            <div className="bg-white border-b border-landing-border p-2 px-3 flex justify-between items-center">
              <span className="text-[0.6rem] font-bold text-landing-ink">Invoicex</span>
              <div className="flex gap-2">
                {["Features","Pricing"].map((l) => (
                  <span key={l} className="text-[0.5rem] text-landing-ink-muted">{l}</span>
                ))}
              </div>
              <div className="bg-landing-accent rounded-[3px] px-2 py-0.5 text-[0.5rem] text-white">
                Start free
              </div>
            </div>
            {/* Mock hero */}
            <div className="p-5 text-center px-3">
              <div className="font-instrument text-[1.1rem] text-landing-ink leading-tight mb-1.5">
                Invoicing that feels like magic.
              </div>
              <div className="text-[0.6rem] text-landing-ink-muted mb-3 leading-relaxed">
                AI-powered billing for freelancers.<br/>
                Create, send, and track in seconds.
              </div>
              <div className="flex gap-1.5 justify-center">
                <div className="bg-landing-accent rounded-full px-3 py-1 text-[0.55rem] text-white">Get Started</div>
                <div className="border border-landing-border rounded-full px-3 py-1 text-[0.55rem] text-landing-ink-muted">Demo</div>
              </div>
            </div>
            {/* Mock features */}
            <div className="grid grid-cols-3 gap-1.5 p-3 pt-0">
              {[
                { icon: "⚡", title: "Fast", desc: "10s gen" },
                { icon: "📊", title: "Live", desc: "Track stats" },
                { icon: "🔁", title: "Auto", desc: "Reminders" },
              ].map((f) => (
                <div key={f.title} className="bg-landing-bg border border-landing-border rounded-lg p-2">
                  <div className="text-[0.7rem] mb-0.5">{f.icon}</div>
                  <div className="text-[0.55rem] font-bold text-landing-ink mb-0.5">{f.title}</div>
                  <div className="text-[0.45rem] text-landing-ink-faint leading-tight">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-landing-bg border border-landing-border rounded-lg p-3 text-left">
             <div className="overflow-hidden space-y-0.5">
              {[
                { indent: 0, text: "<!DOCTYPE html>", color: "text-landing-ink-faint" },
                { indent: 0, text: '<html lang="en">', color: "text-landing-ink-muted" },
                { indent: 1, text: "<head>", color: "text-landing-ink-muted" },
                { indent: 2, text: '<link rel="stylesheet" ... />', color: "text-landing-accent" },
                { indent: 1, text: "</head>", color: "text-landing-ink-muted" },
                { indent: 1, text: "<body>", color: "text-landing-ink-muted" },
                { indent: 2, text: "<nav> ... </nav>", color: "text-landing-ink" },
                { indent: 2, text: "<section> ... </section>", color: "text-landing-ink" },
                { indent: 1, text: "</body>", color: "text-landing-ink-muted" },
              ].map((line, i) => (
                <div key={i} className="flex gap-2.5 text-[0.55rem]">
                  <span className="text-landing-ink-faint w-3 text-right">{i + 1}</span>
                  <span className={`${line.color}`} style={{ paddingLeft: line.indent * 10 }}>{line.text}</span>
                </div>
              ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardMockup() {
  const pages = [
    { prompt: "AI tool for B2B sales cold emails", provider: "gemini", time: "2m ago" },
    { prompt: "Notion-like app for engineering teams", provider: "openai", time: "1h ago" },
    { prompt: "Invoicing SaaS for freelancers", provider: "gemini", time: "yesterday" },
  ];

  return (
    <div className="bg-white border border-landing-border rounded-xl overflow-hidden font-dmsans shadow-landing-md">
      <div className="bg-landing-bg border-b border-landing-border p-2.5 px-3.5 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 bg-white rounded-md py-[3px] px-2.5 text-[0.65rem] text-landing-ink-muted border border-landing-border text-center">
          pageforge.ai/dashboard
        </div>
      </div>

      <div className="p-4 text-left">
        <div className="flex justify-between items-center mb-3.5">
          <div>
            <p className="font-instrument text-lg text-landing-ink tracking-tight leading-none">Your Pages</p>
            <p className="text-[0.6rem] text-landing-ink-faint mt-1">{pages.length} pages generated</p>
          </div>
          <div className="bg-landing-accent text-white text-[0.6rem] font-bold px-2.5 py-1 rounded-md">
            + New
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {pages.map((p, i) => (
            <div key={i} className="bg-white border border-landing-border rounded-lg p-2.5 flex items-center gap-2.5 shadow-sm">
              <span className="text-[0.6rem] text-landing-ink-faint w-3 text-right">
                {String(pages.length - i).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[0.6rem] text-landing-ink font-medium truncate mb-0.5">
                  {p.prompt}
                </p>
                <div className="flex gap-1.5 items-center">
                  <span className={`text-[0.5rem] px-1 rounded-sm border uppercase font-bold tracking-wider ${p.provider === 'gemini' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {p.provider}
                  </span>
                  <span className="text-[0.5rem] text-landing-ink-faint">{p.time}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {["◉","↓","×"].map((icon) => (
                  <div key={icon} className="w-5 h-5 bg-landing-bg rounded-md flex items-center justify-center text-[0.6rem] text-landing-ink-muted cursor-pointer hover:bg-landing-accent hover:text-white transition-colors">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────── */

const STEPS_DATA = [
  {
    number: "01",
    label: "Describe",
    title: "Tell us what you're building",
    description: "Type a plain-English description of your product — what it does, who it's for, and what makes it different. The more specific, the better the output.",
    details: ["Works with any product category", "Supports 1-sentence to full paragraphs", "Example prompts to get you started"],
    mockup: <PromptMockup />,
  },
  {
    number: "02",
    label: "Generate",
    title: "AI builds your page in seconds",
    description: "Your prompt is analyzed and mapped to high-conversion UI patterns. The AI handles the copy, selecting layouts, and styling everything automatically.",
    details: ["Context-aware copy generation", "Intelligent layout selection", "~15 seconds generation time"],
    mockup: <GeneratingMockup />,
  },
  {
    number: "03",
    label: "Preview",
    title: "See it live, download instantly",
    description: "Your page renders in a live preview panel. Inspect the design, preview the code, and download a single production-ready HTML file — no dependencies required.",
    details: ["Real-time iframe preview", "Clean, self-contained HTML", "One-click local download"],
    mockup: <PreviewMockup />,
  },
  {
    number: "04",
    label: "Manage",
    title: "All your pages, in one place",
    description: "Every page you generate is saved to your secure dashboard. Revisit your history, re-download past projects, or refine your workflow at any time.",
    details: ["Automatic history logging", "Permanent project storage", "Quick-action dashboard"],
    mockup: <DashboardMockup />,
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="bg-landing-bg text-landing-ink font-dmsans overflow-x-hidden min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-landing-border bg-white/40 pt-20">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1A1714_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative max-w-[1100px] mx-auto px-8 py-20 pb-16 text-left">
          <div className="max-w-[600px]">
            <p className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-landing-accent mb-6 flex items-center gap-3 before:w-5 before:h-[2px] before:bg-landing-accent before:rounded-full">
              How it works
            </p>
            <h1 className="font-instrument text-[clamp(2.5rem,8vw,5.5rem)] leading-none tracking-tight text-landing-ink mb-8">
              Prompt to <br />
              <em className="italic text-landing-accent not-italic">landing page</em><br />
              in 4 steps.
            </h1>
            <p className="text-[1.05rem] text-landing-ink-muted leading-[1.8] max-w-[480px] mb-10 font-[350]">
              No Figma. No dev time. No templates to wrestle with. Just describe your product and get a production-ready HTML page.
            </p>
            <Link href="/register" className="inline-flex items-center bg-landing-ink text-white rounded-full px-8 py-4 text-base font-medium transition-all hover:bg-landing-accent hover:-translate-y-1 shadow-landing-md">
              Try it free →
            </Link>
          </div>

          {/* Nav Pills */}
          <div className="flex gap-2.5 mt-16 flex-wrap relative z-10">
            {STEPS_DATA.map((s, i) => (
              <button
                key={s.number}
                onClick={() => {
                  setActiveStep(i);
                  stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-[0.8rem] font-semibold font-inherit cursor-pointer transition-all rounded-full border ${activeStep === i ? 'bg-landing-accent border-landing-accent text-white shadow-landing-sm' : 'bg-white border-landing-border text-landing-ink-muted hover:border-landing-accent hover:text-landing-accent'}`}
              >
                <span className={`text-[0.75rem] ${activeStep === i ? 'text-white/80' : 'text-landing-accent/50'}`}>{s.number}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Content */}
      <div className="max-w-[1100px] mx-auto px-8">
        {STEPS_DATA.map((step, i) => (
          <div
            key={step.number}
            ref={(el) => { stepRefs.current[i] = el; }}
            className={`py-24 border-b border-landing-border last:border-none reveal ${activeStep === i ? 'visible' : ''}`}
          >
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center`}>
              {/* Text side */}
              <div className={`${i % 2 === 0 ? 'md:order-1' : 'md:order-2'} text-left`}>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-instrument text-6xl text-landing-accent/10 leading-none tracking-tight">{step.number}</span>
                  <div className="h-px flex-1 bg-landing-border" />
                  <span className="text-[0.7rem] bg-landing-accent/10 text-landing-accent px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {step.label}
                  </span>
                </div>

                <h2 className="font-instrument text-[clamp(1.8rem,4vw,2.8rem)] text-landing-ink tracking-tight leading-tight mb-6">
                  {step.title}
                </h2>

                <p className="text-[1.05rem] text-landing-ink-muted leading-relaxed font-[350] mb-8">
                  {step.description}
                </p>

                <div className="space-y-4">
                  {step.details.map((d) => (
                    <div key={d} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-landing-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-[0.7rem] text-landing-accent font-bold">✓</span>
                      </div>
                      <span className="text-[0.95rem] text-landing-ink-muted leading-relaxed font-[350]">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup side */}
              <div className={`${i % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                {step.mockup}
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <CTA/>
      <Footer/>
    </div>
  );
}