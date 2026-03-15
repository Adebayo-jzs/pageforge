"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeSimpleIcon, CopyCheckIcon, CopyIcon, Download01Icon, ReloadIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect } from "react";

const EXAMPLES = [
  "An AI tool that writes cold emails for B2B sales teams",
  "A Notion-like app built for remote engineering teams",
  "A SaaS platform that automates invoicing for freelancers",
  "A mobile app that tracks your carbon footprint daily",
];

type Tab = "preview" | "code";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [editableCode, setEditableCode] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setHtml("");
    setProvider("");
    setActiveTab("preview");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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

  // Write HTML into iframe whenever html state changes
  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument!;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  // When switching back to preview from code tab, apply any edits
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

  return (
    <main className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Left panel */}
      <aside className="w-96 border-r border-neutral-800 flex flex-col p-8 gap-6 overflow-y-auto">
        <div>
          {/* <h1 className="text-4xl font-black tracking-tight">
            Page<span className="text-yellow-300">Forge</span>
          </h1> */}
          <p className="text-neutral-500 text-sm mt-2">
            Describe your product. Get a landing page.
          </p>
        </div>

        <textarea
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm
                     text-neutral-200 resize-none outline-none focus:border-yellow-300/50
                     transition-colors placeholder:text-neutral-600"
          placeholder="e.g. A SaaS tool that turns Figma designs into production React components..."
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.metaKey && generate()}
        />

        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-yellow-300 text-black font-bold py-3 rounded-xl
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-yellow-200 transition-colors text-sm"
        >
          {loading ? "Generating..." : " Generate Landing Page"}
        </button>

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
      </aside>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* Tabs */}
          <div className="flex bg-neutral-800 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-neutral-700 text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <HugeiconsIcon icon={ViewIcon} className="w-5 h-5"/> Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-all ${
                activeTab === "code"
                  ? "bg-neutral-700 text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {/* {"</>"} Code */}
              <HugeiconsIcon icon={CodeSimpleIcon} className="w-5 h-5"/> Code
            </button>
          </div>

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
              {copied ? <HugeiconsIcon icon={CopyCheckIcon} className="w-5 h-5" /> : <HugeiconsIcon icon={CopyIcon} className="w-5 h-5"/>}
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
              <HugeiconsIcon icon={ReloadIcon} className="w-5 h-5"/>
            </button>
          )}

          {html && (
            <button
              onClick={downloadHtml}
              className="text-xs bg-yellow-300 text-black font-bold px-3 py-1.5 rounded-lg
                         hover:bg-yellow-200 transition-colors"
            >
              <HugeiconsIcon icon={Download01Icon} className="w-5 h-5"/>
            </button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Empty state */}
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
              {/* <div className="w-8 h-8 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin mb-4" /> */}
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
              {/* Line numbers + editable code */}
              <div className="flex-1 flex overflow-hidden">
                {/* Line numbers — synced via textarea scroll */}
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

                {/* Editable code area */}
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

              {/* Code tab footer */}
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