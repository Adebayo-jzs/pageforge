"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeSimpleIcon,
  CopyCheckIcon,
  CopyIcon,
  Download01Icon,
  ReloadIcon,
  ViewIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";

type Tab = "preview" | "code";

export default function Workspace({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // React 19 / Next 15 compatible param unwrapping
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Project data
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [provider, setProvider] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // Editor states
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [editableCode, setEditableCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  // Fetch initial project data
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();
        
        setPrompt(data.prompt);
        setHtml(data.html);
        setEditableCode(data.html);
        setProvider(data.provider || "gemini");
        setCreatedAt(data.createdAt);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const regenerate = async () => {
    setIsRegenerating(true);
    setError("");
    
    try {
      // Re-generate using the existing prompt
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // We have new code! Update it. We don't overwrite the ID,
      // we'll update the existing document or just reload it in the UI.
      // For simplicity right now, let's just update the local editor.
      setHtml(data.html);
      setEditableCode(data.html);
      setProvider(data.provider);
      setActiveTab("preview");
      
      // Update the document in MongoDB with the new HTML
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: data.html, provider: data.provider })
      });
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    if (iframeRef.current && html && !loading) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html, loading]);

  useEffect(() => {
    if (activeTab === "preview" && editableCode && editableCode !== html) {
      setHtml(editableCode);
      // Optional: automatically save to DB here when they switch back to preview
    }
  }, [activeTab]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/p/${id}`;
    await navigator.clipboard.writeText(url);
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

  if (loading) {
    return (
      <main className="flex h-screen bg-neutral-950 items-center justify-center">
        <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-yellow-300 w-8 h-8" />
      </main>
    );
  }

  if (error && !html) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 px-6">
        <div className="bg-red-950 border border-red-900 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:bg-neutral-800"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* ───── Left panel (Prompt History / Context) ───── */}
      <aside className="w-80 lg:w-96 border-r border-neutral-800 flex flex-col overflow-y-auto bg-neutral-950 shrink-0">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/40">
          <button onClick={() => router.push("/")} className="text-neutral-400 hover:text-white transition-colors">
            ← Home
          </button>
          <h2 className="text-sm font-semibold text-neutral-300 tracking-wide uppercase">Workspace</h2>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* Prompt History block */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Prompt Context</h3>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-sm relative group">
              <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {prompt}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              <span className="text-[11px] text-neutral-500 font-medium">
                Model: <span className="text-neutral-300 capitalize">{provider}</span>
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">
                Created: <span className="text-neutral-300">{new Date(createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="h-px bg-neutral-800/60 my-2"></div>

          {/* Regenerate Action */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Actions</h3>
            <button
              onClick={regenerate}
              disabled={isRegenerating}
              className="w-full bg-yellow-300 text-black font-bold py-3 rounded-xl
                         disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-yellow-300/5
                         hover:bg-yellow-200 transition-colors text-sm flex items-center justify-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <HugeiconsIcon icon={ReloadIcon} className="animate-spin w-4 h-4" />
                  Generating New Version...
                </>
              ) : (
                "⚡ Regenerate Design"
              )}
            </button>
            
            <button
              onClick={() => {
                const p = new URLSearchParams({ prompt: prompt.split('\n\n')[0] });
                router.push(`/new?${p.toString()}`);
              }}
              className="w-full border border-neutral-700 text-neutral-300 font-medium py-3 rounded-xl
                         hover:bg-neutral-800 transition-colors text-sm"
            >
              Start New Flow With Prompt
            </button>
          </div>

          <div className="h-px bg-neutral-800/60 my-2"></div>

          {/* Share Block */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Share Link</h3>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 pl-3">
              <input 
                type="text" 
                readOnly 
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${id}`}
                className="flex-1 bg-transparent text-xs text-neutral-400 outline-none truncate"
              />
              <button 
                onClick={copyLink}
                title="Copy Link"
                className="p-2 bg-neutral-800 rounded hover:bg-neutral-700 hover:text-white transition-colors text-neutral-400"
              >
                {copied ? <HugeiconsIcon icon={CopyCheckIcon} className="w-3 h-3 text-green-400" /> : <HugeiconsIcon icon={Link01Icon} className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* ───── Right panel (Code / Preview) ───── */}
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-[#0d1117]">
          <div className="flex gap-1.5 items-center mr-6">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Tabs */}
          <div className="flex bg-neutral-900 rounded-lg p-1 shadow-inner border border-neutral-800/60">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-neutral-700 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" /> Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-all ${
                activeTab === "code"
                  ? "bg-neutral-700 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <HugeiconsIcon icon={CodeSimpleIcon} className="w-4 h-4" /> Code
            </button>
          </div>

          <div className="flex gap-2 ml-auto">
            {/* Download */}
            <button
              onClick={downloadHtml}
              title="Download HTML"
              className="text-xs bg-neutral-800/80 text-neutral-300 border border-neutral-700/50
                         hover:text-yellow-300 px-3 py-1.5 rounded-lg hover:bg-neutral-800
                         transition-all flex items-center gap-1.5"
            >
              <HugeiconsIcon icon={Download01Icon} className="w-4 h-4" />
            </button>
            
            {/* Copy Code */}
            {activeTab === "code" && (
              <button
                onClick={copyCode}
                className="text-xs bg-neutral-800/80 text-neutral-300 border border-neutral-700/50
                           px-3 py-1.5 rounded-lg hover:bg-neutral-800
                           transition-all flex items-center gap-1.5"
              >
                {copied && activeTab === "code" ? (
                  <HugeiconsIcon icon={CopyCheckIcon} className="w-4 h-4 text-green-400" />
                ) : (
                  <HugeiconsIcon icon={CopyIcon} className="w-4 h-4" />
                )}
                <span className="hidden sm:inline font-medium">Copy Code</span>
              </button>
            )}

            {/* Reload Preview */}
            {activeTab === "preview" && (
              <button
                onClick={() => {
                  if (iframeRef.current) {
                    const doc = iframeRef.current.contentDocument!;
                    doc.open();
                    doc.write(editableCode || html);
                    doc.close();
                  }
                }}
                className="text-xs bg-neutral-800/80 text-neutral-300 border border-neutral-700/50
                           px-3 py-1.5 rounded-lg hover:bg-neutral-800
                           transition-all flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={ReloadIcon} className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Refresh</span>
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 relative overflow-hidden bg-white">
          {isRegenerating && (
             <div className="absolute inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-neutral-200">
               <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-yellow-300 w-10 h-10 mb-4" />
               <p className="font-bold tracking-wide">Rebuilding Code...</p>
             </div>
          )}
          
          {/* Preview tab */}
          <div className={activeTab === "preview" ? "w-full h-full block" : "hidden"}>
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none bg-white"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* Code tab */}
          <div className={activeTab === "code" ? "absolute inset-0 flex flex-col bg-[#0d1117]" : "hidden"}>
            <div className="flex-1 flex overflow-hidden">
              <div
                ref={lineNumRef}
                className="select-none text-right pr-4 pl-4 pt-4 pb-4 text-neutral-600/60
                           text-xs leading-6 font-mono border-r border-neutral-800/60
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

            <div className="flex items-center justify-between px-5 py-2.5 border-t border-neutral-800
                            bg-[#161b22] text-xs text-neutral-500">
              <span className="font-mono">
                {editableCode.split("\n").length} lines · {(editableCode.length / 1024).toFixed(1)} KB
              </span>
              {editableCode !== html && (
                <span className="flex items-center gap-2 font-medium text-yellow-300/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Modified visually. Switch to Preview to render.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
