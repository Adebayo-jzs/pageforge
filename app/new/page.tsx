"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeSimpleIcon,
  CopyCheckIcon,
  CopyIcon,
  Download01Icon,
  ReloadIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect } from "react";

const EXAMPLES = [
  "An AI tool that writes cold emails for B2B sales teams",
  "A Notion-like app built for remote engineering teams",
  "A SaaS platform that automates invoicing for freelancers",
  "A mobile app that tracks your carbon footprint daily",
];

type Tab = "preview" | "code";
type Step = "describe" | "details" | "result";

interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  github: string;
  website: string;
}

const EMPTY_DETAILS: BusinessDetails = {
  name: "",
  email: "",
  phone: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  github: "",
  website: "",
};

// ─── Input field helper (outside component to preserve focus) ───
function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-neutral-500 font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm
                   text-neutral-200 outline-none focus:border-yellow-300/50
                   transition-colors placeholder:text-neutral-700"
      />
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("describe");
  const [prompt, setPrompt] = useState("");
  const [details, setDetails] = useState<BusinessDetails>(EMPTY_DETAILS);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [editableCode, setEditableCode] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  const updateDetail = (key: keyof BusinessDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setStep("result");
    setLoading(true);
    setError("");
    setHtml("");
    setProvider("");
    setActiveTab("preview");

    // Build the full prompt with optional details
    const filledDetails = Object.entries(details)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const fullPrompt = filledDetails
      ? `${prompt}\n\nBusiness/Contact Details (use these in the page where appropriate):\n${filledDetails}`
      : prompt;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHtml(data.html);
      setEditableCode(data.html);
      setProvider(data.provider);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument!;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  useEffect(() => {
    if (activeTab === "preview" && editableCode && editableCode !== html) {
      setHtml(editableCode);
    }
  }, [activeTab]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([editableCode || html], { type: "text/html" })
    );
    a.download = "landing-page.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const startOver = () => {
    setStep("describe");
    setPrompt("");
    setDetails(EMPTY_DETAILS);
    setHtml("");
    setEditableCode("");
    setError("");
    setProvider("");
  };



  return (
    <main className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* ───── Left panel ───── */}
      <aside className="w-96 border-r border-neutral-800 flex flex-col overflow-y-auto">
        {/* Logo — always visible */}
        <div className="p-8 pb-0">
          <h1 className="text-4xl font-black tracking-tight">
            Page<span className="text-yellow-300">Forge</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">
            Describe your product. Get a landing page.
          </p>
        </div>

        <div className="flex-1 flex flex-col p-8 pt-6 gap-5">
          {/* ─── Step 1: Description ─── */}
          {step === "describe" && (
            <>
              <textarea
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm
                           text-neutral-200 resize-none outline-none focus:border-yellow-300/50
                           transition-colors placeholder:text-neutral-600"
                placeholder="e.g. A SaaS tool that turns Figma designs into production React components..."
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    if (prompt.trim()) setStep("details");
                  }
                }}
              />

              <button
                onClick={() => setStep("details")}
                disabled={!prompt.trim()}
                className="w-full bg-yellow-300 text-black font-bold py-3 rounded-xl
                           disabled:opacity-40 disabled:cursor-not-allowed
                           hover:bg-yellow-200 transition-colors text-sm"
              >
                Next →
              </button>

              {/* Examples */}
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-neutral-600 font-semibold">
                  Try an example
                </p>
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="text-left text-xs text-neutral-500 border border-neutral-800
                               rounded-lg p-3 hover:border-neutral-600 hover:text-neutral-300
                               transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ─── Step 2: Business Details (optional) ─── */}
          {step === "details" && (
            <>
              {/* Description summary */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
                <p className="text-[11px] text-neutral-500 font-medium mb-1">Product Description</p>
                <p className="text-xs text-neutral-300 line-clamp-3">{prompt}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1">Business Details</h3>
                <p className="text-xs text-neutral-500">
                  Optional — add contact info and socials to include in your page.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Field label="Business / Brand Name" placeholder="Acme Corp" value={details.name} onChange={(v) => updateDetail("name", v)} />
                <Field label="Email" placeholder="hello@acme.com" value={details.email} onChange={(v) => updateDetail("email", v)} />
                <Field label="Phone" placeholder="+1 (555) 123-4567" value={details.phone} onChange={(v) => updateDetail("phone", v)} />
                <Field label="Website" placeholder="https://acme.com" value={details.website} onChange={(v) => updateDetail("website", v)} />

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-px bg-neutral-800" />
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600">Socials</span>
                  <div className="flex-1 h-px bg-neutral-800" />
                </div>

                <Field label="Twitter / X" placeholder="@acmecorp" value={details.twitter} onChange={(v) => updateDetail("twitter", v)} />
                <Field label="Instagram" placeholder="@acmecorp" value={details.instagram} onChange={(v) => updateDetail("instagram", v)} />
                <Field label="LinkedIn" placeholder="company/acme-corp" value={details.linkedin} onChange={(v) => updateDetail("linkedin", v)} />
                <Field label="GitHub" placeholder="acmecorp" value={details.github} onChange={(v) => updateDetail("github", v)} />
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setStep("describe")}
                  className="flex-1 border border-neutral-700 text-neutral-300 font-medium py-2.5 rounded-xl
                             hover:bg-neutral-800 transition-colors text-sm"
                >
                  ← Back
                </button>
                <button
                  onClick={generate}
                  className="flex-1 bg-yellow-300 text-black font-bold py-2.5 rounded-xl
                             hover:bg-yellow-200 transition-colors text-sm"
                >
                  ⚡ Generate
                </button>
              </div>
            </>
          )}

          {/* ─── Step 3: Result state ─── */}
          {step === "result" && (
            <>
              {/* Description summary */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
                <p className="text-[11px] text-neutral-500 font-medium mb-1">Product Description</p>
                <p className="text-xs text-neutral-300 line-clamp-3">{prompt}</p>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-950 border border-red-900 rounded-lg p-3">
                  {error}
                </p>
              )}

              {provider && (
                <p className="text-xs text-neutral-600 text-center">
                  Generated with <span className="text-neutral-400">{provider}</span>
                </p>
              )}

              {/* Regenerate & Start Over */}
              <div className="flex gap-2">
                <button
                  onClick={startOver}
                  className="flex-1 border border-neutral-700 text-neutral-300 font-medium py-2.5 rounded-xl
                             hover:bg-neutral-800 transition-colors text-sm"
                >
                  ← New Page
                </button>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="flex-1 bg-yellow-300 text-black font-bold py-2.5 rounded-xl
                             disabled:opacity-40 disabled:cursor-not-allowed
                             hover:bg-yellow-200 transition-colors text-sm"
                >
                  {loading ? "Generating..." : "⚡ Regenerate"}
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ───── Right panel ───── */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* Tabs — only show when there's content */}
          {html && (
            <div className="flex bg-neutral-800 rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-neutral-700 text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <HugeiconsIcon icon={ViewIcon} className="w-5 h-5" /> Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-all ${
                  activeTab === "code"
                    ? "bg-neutral-700 text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <HugeiconsIcon icon={CodeSimpleIcon} className="w-5 h-5" /> Code
              </button>
            </div>
          )}

          <div className="flex-1 bg-neutral-800 rounded-md px-3 py-1 text-xs text-neutral-500 text-center">
            {html ? "your-page.html" : "preview"}
          </div>

          {/* Code tab actions */}
          {html && activeTab === "code" && (
            <button
              onClick={copyCode}
              className="text-xs bg-neutral-800 text-neutral-300 border border-neutral-700
                         font-medium px-3 py-1.5 rounded-lg hover:bg-neutral-700
                         transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <HugeiconsIcon icon={CopyCheckIcon} className="w-5 h-5" />
              ) : (
                <HugeiconsIcon icon={CopyIcon} className="w-5 h-5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          )}

          {/* Reload preview */}
          {html && activeTab === "preview" && (
            <button
              onClick={() => {
                if (iframeRef.current) {
                  const doc = iframeRef.current.contentDocument!;
                  doc.open();
                  doc.write(editableCode || html);
                  doc.close();
                }
              }}
              className="text-xs bg-neutral-800 text-neutral-300 border border-neutral-700
                         font-medium px-3 py-1.5 rounded-lg hover:bg-neutral-700
                         transition-colors"
              title="Reload preview"
            >
              <HugeiconsIcon icon={ReloadIcon} className="w-5 h-5" />
            </button>
          )}

          {html && (
            <button
              onClick={downloadHtml}
              className="text-xs bg-yellow-300 text-black font-bold px-3 py-1.5 rounded-lg
                         hover:bg-yellow-200 transition-colors"
            >
              <HugeiconsIcon icon={Download01Icon} className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Empty state — shown before any generation */}
          {!html && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-700">
              <span className="text-5xl mb-4">◈</span>
              <p className="font-semibold">Your page will appear here</p>
              <p className="text-sm mt-1">Describe your product and hit generate</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600">
              <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-yellow-300 mb-4" />
              <p className="font-semibold">Building your page...</p>
            </div>
          )}

          {/* Preview tab */}
          {html && activeTab === "preview" && (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}

          {/* Code tab */}
          {html && activeTab === "code" && (
            <div className="absolute inset-0 flex flex-col bg-[#0d1117]">
              <div className="flex-1 flex overflow-hidden">
                <div
                  ref={lineNumRef}
                  className="select-none text-right pr-4 pl-4 pt-4 pb-4 text-neutral-600
                             text-xs leading-6 font-mono border-r border-neutral-800
                             bg-[#0d1117] overflow-hidden shrink-0"
                >
                  {editableCode.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                <textarea
                  className="flex-1 bg-transparent text-neutral-300 text-xs leading-6
                             font-mono p-4 outline-none resize-none min-w-0
                             selection:bg-yellow-300/20 overflow-auto"
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  onScroll={(e) => {
                    if (lineNumRef.current) {
                      lineNumRef.current.scrollTop = e.currentTarget.scrollTop;
                    }
                  }}
                  spellCheck={false}
                  wrap="off"
                />
              </div>

              <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800
                              bg-[#161b22] text-xs text-neutral-500">
                <span>
                  {editableCode.split("\n").length} lines · {editableCode.length} chars
                </span>
                {editableCode !== html && (
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Modified — switch to Preview to apply changes
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}