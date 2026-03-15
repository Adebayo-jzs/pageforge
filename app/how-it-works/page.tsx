"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: 16,
      overflow: "hidden",
      fontFamily: "'DM Mono', monospace",
    }}>
      {/* Browser chrome */}
      <div style={{
        background: "#0d0d0d",
        borderBottom: "1px solid #1a1a1a",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: "#111", borderRadius: 5,
          padding: "3px 10px", fontSize: 10, color: "#333", textAlign: "center",
        }}>
          pageforge.com
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 22, fontWeight: 300, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Page<span style={{ color: "#e8ff47" }}>Forge</span>
          </p>
          <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>Describe your product. Get a landing page.</p>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 14px", minHeight: 64 }}>
            <p style={{ fontSize: 11, color: "#ccc", lineHeight: 1.6 }}>
              {typed}
              <span style={{
                display: "inline-block",
                width: 1.5,
                height: 12,
                background: "#e8ff47",
                marginLeft: 1,
                animation: "blink 1s step-end infinite",
                verticalAlign: "middle",
              }} />
            </p>
          </div>
          <div style={{
            borderTop: "1px solid #1a1a1a",
            padding: "8px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 10, color: "#333" }}>⌘ + Enter to submit</span>
            <div style={{
              background: "#e8ff47",
              color: "#000",
              borderRadius: 7,
              padding: "4px 10px",
              fontSize: 10,
              fontWeight: 500,
            }}>→</div>
          </div>
        </div>

        {/* Example chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
          {["B2B SaaS", "Mobile App", "Dev Tool"].map((tag) => (
            <span key={tag} style={{
              fontSize: 9,
              color: "#555",
              border: "1px solid #1e1e1e",
              borderRadius: 20,
              padding: "3px 8px",
            }}>{tag}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
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
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: 16,
      overflow: "hidden",
      fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{
        background: "#0d0d0d",
        borderBottom: "1px solid #1a1a1a",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#111", borderRadius: 5, padding: "3px 10px", fontSize: 10, color: "#333", textAlign: "center" }}>
          pageforge.com/new
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Split view */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {/* Left — status */}
          <div>
            <p style={{ fontSize: 10, color: "#444", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {steps.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                    border: `1px solid ${i < step ? "#e8ff47" : i === step ? "#e8ff47" : "#222"}`,
                    background: i < step ? "#e8ff47" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                  }}>
                    {i < step && <span style={{ fontSize: 7, color: "#000", fontWeight: 700 }}>✓</span>}
                    {i === step && (
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: "#e8ff47",
                        animation: "ping 1s ease-in-out infinite",
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 9,
                    color: i < step ? "#666" : i === step ? "#ccc" : "#2a2a2a",
                    transition: "color 0.3s",
                  }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — preview skeleton */}
          <div style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: 8,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}>
            <p style={{ fontSize: 9, color: "#333", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Preview</p>
            {/* Skeleton bars */}
            {[100, 70, 85, 50, 90, 60, 75].map((w, i) => (
              <div key={i} style={{
                height: i === 0 ? 10 : 5,
                width: `${w}%`,
                background: "#1a1a1a",
                borderRadius: 3,
                animation: `shimmer 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                opacity: progress > i * 12 ? 1 : 0.2,
                transition: "opacity 0.5s",
              }} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "#444" }}>Generating with Gemini 2.5 Flash</span>
            <span style={{ fontSize: 9, color: "#e8ff47" }}>{Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min(progress, 100)}%`,
              background: "#e8ff47",
              borderRadius: 2,
              transition: "width 0.1s linear",
            }} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.6)} }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
      `}</style>
    </div>
  );
}

function PreviewMockup() {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: 16,
      overflow: "hidden",
      fontFamily: "'DM Mono', monospace",
    }}>
      {/* Browser chrome */}
      <div style={{
        background: "#0d0d0d",
        borderBottom: "1px solid #1a1a1a",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#111", borderRadius: 5, padding: "3px 10px", fontSize: 10, color: "#555", textAlign: "center" }}>
          your-page.html
        </div>
        <div style={{
          background: "#e8ff47",
          color: "#000",
          fontSize: 9,
          fontWeight: 600,
          padding: "3px 9px",
          borderRadius: 5,
          cursor: "pointer",
        }}>
          ↓ Download
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #1a1a1a",
        padding: "0 14px",
      }}>
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 12px",
              fontSize: 10,
              color: tab === t ? "#e8ff47" : "#444",
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "1px solid #e8ff47" : "1px solid transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.04em",
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: 14 }}>
        {tab === "preview" ? (
          /* Fake landing page preview */
          <div style={{
            background: "#030303",
            border: "1px solid #111",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            {/* Mock nav */}
            <div style={{
              background: "#050505",
              borderBottom: "1px solid #111",
              padding: "7px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>InvoiceAI</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["Features","Pricing","Docs"].map((l) => (
                  <span key={l} style={{ fontSize: 8, color: "#444" }}>{l}</span>
                ))}
              </div>
              <div style={{ background: "#6366f1", borderRadius: 4, padding: "3px 8px", fontSize: 8, color: "#fff" }}>
                Start free
              </div>
            </div>
            {/* Mock hero */}
            <div style={{ padding: "20px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>
                Get Paid 3× Faster
              </div>
              <div style={{ fontSize: 8, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>
                AI-powered invoicing for freelancers.<br/>
                Create, send, and track in seconds.
              </div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                <div style={{ background: "#6366f1", borderRadius: 5, padding: "5px 12px", fontSize: 8, color: "#fff" }}>Try for free</div>
                <div style={{ border: "1px solid #333", borderRadius: 5, padding: "5px 12px", fontSize: 8, color: "#888" }}>See demo</div>
              </div>
            </div>
            {/* Mock features */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: "0 12px 14px" }}>
              {[
                { icon: "⚡", title: "Instant invoices", desc: "Generate in 10s" },
                { icon: "📊", title: "Live tracking", desc: "See who viewed" },
                { icon: "🔁", title: "Auto reminders", desc: "Never chase again" },
              ].map((f) => (
                <div key={f.title} style={{
                  background: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  borderRadius: 6,
                  padding: "8px",
                }}>
                  <div style={{ fontSize: 12, marginBottom: 3 }}>{f.icon}</div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: "#ddd", marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 7, color: "#555" }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Code view */
          <div style={{
            background: "#030303",
            border: "1px solid #111",
            borderRadius: 8,
            padding: "12px",
            fontFamily: "'DM Mono', monospace",
          }}>
            {[
              { indent: 0, color: "#666", text: "<!DOCTYPE html>" },
              { indent: 0, color: "#888", text: '<html lang="en">' },
              { indent: 1, color: "#888", text: "<head>" },
              { indent: 2, color: "#6366f1", text: '<link rel="stylesheet" href="..." />' },
              { indent: 1, color: "#888", text: "</head>" },
              { indent: 1, color: "#888", text: "<body>" },
              { indent: 2, color: "#e8ff47", text: "<nav> <!-- sticky nav --> </nav>" },
              { indent: 2, color: "#e8ff47", text: "<section> <!-- hero --> </section>" },
              { indent: 2, color: "#4ade80", text: "<section> <!-- features --> </section>" },
              { indent: 2, color: "#4ade80", text: "<section> <!-- pricing --> </section>" },
              { indent: 2, color: "#888", text: "<footer> ... </footer>" },
              { indent: 1, color: "#888", text: "</body>" },
              { indent: 0, color: "#888", text: "</html>" },
            ].map((line, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 8,
                padding: "1.5px 0",
              }}>
                <span style={{ fontSize: 8, color: "#2a2a2a", minWidth: 14, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                <span style={{
                  fontSize: 8,
                  color: line.color,
                  paddingLeft: line.indent * 12,
                  whiteSpace: "nowrap",
                }}>{line.text}</span>
              </div>
            ))}
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
    { prompt: "Carbon footprint tracker mobile app", provider: "gemini", time: "3h ago" },
    { prompt: "Invoicing SaaS for freelancers", provider: "gemini", time: "yesterday" },
  ];

  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: 16,
      overflow: "hidden",
      fontFamily: "'DM Mono', monospace",
    }}>
      {/* Browser chrome */}
      <div style={{
        background: "#0d0d0d",
        borderBottom: "1px solid #1a1a1a",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#111", borderRadius: 5, padding: "3px 10px", fontSize: 10, color: "#555", textAlign: "center" }}>
          pageforge.com/dashboard
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 300, color: "#fff", letterSpacing: "-0.03em" }}>Your Pages</p>
            <p style={{ fontSize: 9, color: "#444", marginTop: 2 }}>{pages.length} pages generated</p>
          </div>
          <div style={{
            background: "#e8ff47", color: "#000",
            fontSize: 9, fontWeight: 600,
            padding: "5px 10px", borderRadius: 7, cursor: "pointer",
          }}>
            + New Page
          </div>
        </div>

        {/* Page cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {pages.map((p, i) => (
            <div key={i} style={{
              background: "#0d0d0d",
              border: "1px solid #1a1a1a",
              borderRadius: 9,
              padding: "9px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontSize: 9, color: "#2a2a2a", minWidth: 16, textAlign: "right" }}>
                {String(pages.length - i).padStart(2, "0")}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 9, color: "#ccc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>
                  {p.prompt}
                </p>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{
                    fontSize: 8,
                    padding: "1px 5px",
                    borderRadius: 3,
                    background: p.provider === "gemini" ? "#1a2a1a" : "#1a1a2a",
                    color: p.provider === "gemini" ? "#4ade80" : "#818cf8",
                    border: `1px solid ${p.provider === "gemini" ? "#1f3a1f" : "#1f1f3a"}`,
                  }}>
                    {p.provider}
                  </span>
                  <span style={{ fontSize: 8, color: "#333" }}>{p.time}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["◉","↓","×"].map((icon) => (
                  <div key={icon} style={{
                    width: 20, height: 20,
                    background: "#1a1a1a",
                    borderRadius: 5,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: "#555", cursor: "pointer",
                  }}>
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

const steps = [
  {
    number: "01",
    label: "Describe",
    title: "Tell us what you're building",
    description: "Type a plain-English description of your product — what it does, who it's for, what makes it different. The more specific, the better the output. No templates, no forms.",
    details: ["Works with any product category", "Supports 1-sentence to full paragraphs", "Example prompts to get you started"],
    mockup: <PromptMockup />,
  },
  {
    number: "02",
    label: "Generate",
    title: "AI builds your page in seconds",
    description: "Your prompt is sent to Gemini 2.5 Flash. If that fails, GPT-4o takes over automatically. The AI writes the copy, designs the layout, and outputs a complete, styled HTML file.",
    details: ["Gemini 2.5 Flash as primary — fast and free", "Automatic GPT-4o fallback", "~15 seconds average generation time"],
    mockup: <GeneratingMockup />,
  },
  {
    number: "03",
    label: "Preview",
    title: "See it live, download instantly",
    description: "Your page renders in a live preview panel the moment it's ready. Inspect the HTML, preview the design, and download the file — one self-contained HTML file, no dependencies.",
    details: ["Full live iframe preview", "View raw HTML source", "One-click download"],
    mockup: <PreviewMockup />,
  },
  {
    number: "04",
    label: "Manage",
    title: "All your pages, in one place",
    description: "Every page you generate is saved to your account. Revisit, re-download, or delete from your dashboard. Your generation history is always accessible.",
    details: ["Saved automatically after generation", "Preview any past page instantly", "Delete what you don't need"],
    mockup: <DashboardMockup />,
  },
];

export default function HowItWorksPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { threshold: 0.5 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
    <Navbar/>
    
    <main style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#ccc",
      fontFamily: "'DM Mono', monospace",
    }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        .grid-bg {
          position: absolute; inset: 0;
          background-image: linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.4; pointer-events: none;
        }
        .step-dot { transition: all 0.3s; }
        .cta-btn {
          background: #e8ff47; color: #000;
          border: none; border-radius: 10px;
          padding: 12px 24px; font-size: 13px; font-weight: 500;
          font-family: 'DM Mono', monospace;
          cursor: pointer; letter-spacing: 0.03em; transition: all 0.15s;
          text-decoration: none; display: inline-block;
        }
        .cta-btn:hover { background: #d4eb3a; }
        .cta-btn:active { transform: scale(0.97); }
        @media (max-width: 768px) {
          .step-grid { grid-template-columns: 1fr !important; }
          .step-grid > div:first-child { order: 2; }
          .step-grid > div:last-child { order: 1; }
          .sticky-progress { display: none !important; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #111" }}>
        <div className="grid-bg" />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "80px 32px 72px" }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 11, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              How it works
            </p>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 8vw, 80px)",
              color: "#fff",
              letterSpacing: "0.02em",
              lineHeight: 1,
              marginBottom: 20,
            }}>
              Prompt to<br />
              <span style={{ color: "#e8ff47" }}>landing page</span><br />
              in 4 steps.
            </h1>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, maxWidth: 420, marginBottom: 32 }}>
              No Figma. No dev time. No templates to wrestle with. Just describe your product and get a production-ready HTML page.
            </p>
            <Link href="/register" className="cta-btn">
              Try it free →
            </Link>
          </div>

          {/* Step pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 48, flexWrap: "wrap" }}>
            {steps.map((s, i) => (
              <button
                key={s.number}
                onClick={() => {
                  setActiveStep(i);
                  stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                style={{
                  background: activeStep === i ? "#0d0d00" : "transparent",
                  border: `1px solid ${activeStep === i ? "#2a2a00" : "#1e1e1e"}`,
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 11,
                  color: activeStep === i ? "#e8ff47" : "#444",
                  fontFamily: "'DM Mono', monospace",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <span style={{ fontSize: 9, color: activeStep === i ? "#e8ff47" : "#333" }}>{s.number}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        {steps.map((step, i) => (
          <div
            key={step.number}
            ref={(el) => { stepRefs.current[i] = el; }}
            style={{
              padding: "80px 0",
              borderBottom: i < steps.length - 1 ? "1px solid #111" : "none",
            }}
          >
            <div
              className="step-grid"
              style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
                gap: 64,
                alignItems: "center",
              }}
            >
              {/* Text side */}
              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 56,
                    color: "#1a1a1a",
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                  }}>{step.number}</span>
                  <div style={{ height: 1, flex: 1, background: "#1a1a1a" }} />
                  <span style={{
                    fontSize: 10,
                    color: "#e8ff47",
                    background: "#0d0d00",
                    border: "1px solid #2a2a00",
                    borderRadius: 20,
                    padding: "3px 10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>
                    {step.label}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  color: "#fff",
                  letterSpacing: "0.02em",
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}>
                  {step.title}
                </h2>

                <p style={{
                  fontSize: 13,
                  color: "#555",
                  lineHeight: 1.9,
                  marginBottom: 28,
                }}>
                  {step.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {step.details.map((d) => (
                    <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{
                        width: 16, height: 16,
                        borderRadius: "50%",
                        background: "#0d0d00",
                        border: "1px solid #2a2a00",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 1,
                      }}>
                        <span style={{ fontSize: 7, color: "#e8ff47" }}>✓</span>
                      </span>
                      <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup side */}
              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                {step.mockup}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <section style={{
        borderTop: "1px solid #111",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="grid-bg" />
        <div style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 32px",
          textAlign: "center",
        }}>
          <div style={{ width: 32, height: 2, background: "#e8ff47", margin: "0 auto 24px" }} />
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            color: "#fff",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
            marginBottom: 16,
          }}>
            Ready to build your<br />
            <span style={{ color: "#e8ff47" }}>landing page?</span>
          </h2>
          <p style={{ fontSize: 13, color: "#444", marginBottom: 36 }}>
            No credit card. No setup. Just your product description.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="cta-btn">
              Start for free →
            </Link>
            <button
              onClick={() => router.push("/")}
              style={{
                background: "transparent",
                border: "1px solid #222",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 13,
                color: "#555",
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#444")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#222")}
            >
              See a demo
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 48,
            marginTop: 56,
            paddingTop: 40,
            borderTop: "1px solid #111",
            flexWrap: "wrap",
          }}>
            {[
              { n: "~15s", label: "avg generation time" },
              { n: "2", label: "AI providers" },
              { n: "100%", label: "yours to keep" },
              { n: "Free", label: "to get started" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 32,
                  color: "#e8ff47",
                  letterSpacing: "0.03em",
                  lineHeight: 1,
                }}>
                  {s.n}
                </p>
                <p style={{ fontSize: 10, color: "#333", marginTop: 4, letterSpacing: "0.06em" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}