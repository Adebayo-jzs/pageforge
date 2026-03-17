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
  SmartPhone01Icon,
  TabletIcon,
  Monitor,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import TextIcon from "@/components/texticon";

type Tab = "preview" | "code";

function formatHtml(html: string) {
  let formatted = "";
  let indent = 0;
  const tab = "  ";
  // Remove existing newlines/extra spaces between tags to start fresh
  const cleanHtml = html.replace(/>\s+</g, "><").trim();
  
  cleanHtml.split(/(?=<)/g).forEach((node) => {
    if (node.startsWith("</")) {
      indent--;
      formatted += tab.repeat(indent) + node + "\n";
    } else if (node.startsWith("<") && !node.startsWith("<!") && !node.endsWith("/>") && !node.includes("</")) {
      // Check for self-closing tags (simplified)
      const isSelfClosing = /<(br|hr|img|input|link|meta|area|base|col|embed|param|source|track|wbr)[^>]*>/i.test(node);
      formatted += tab.repeat(indent) + node + "\n";
      if (!isSelfClosing) indent++;
    } else {
      formatted += tab.repeat(indent) + node + "\n";
    }
  });
  return formatted.trim();
}

export default function Workspace({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [activePagePath, setActivePagePath] = useState("/");
  const [provider, setProvider] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [previewMode, setPreviewMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [editableCode, setEditableCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();
        
        const projectPages = data.pages || [];
        setPages(projectPages);
        
        const homePage = projectPages.length > 0 ? (projectPages.find((p: any) => p.path === "/" || p.path === "index.html") || projectPages[0]) : null;
        const homePath = homePage ? homePage.path : "/";
        const homeHtml = data.html || (homePage?.html || "");
        
        setPrompt(data.prompt || "");
        setActivePagePath(homePath);
        setHtml(homeHtml || "");
        setEditableCode(formatHtml(homeHtml || ""));
        setProvider(data.provider || "gemini");
        setCreatedAt(data.createdAt || "");
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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPages(data.pages || []);
      const newHomeHtml = data.pages && data.pages.length > 0 ? (data.pages.find((p: any) => p.path === "/" || p.path === "index.html")?.html || data.pages[0]?.html) : data.html;
      setHtml(newHomeHtml || data.html);
      setEditableCode(formatHtml(newHomeHtml || data.html || ""));
      setActivePagePath("/");
      setProvider(data.provider);
      setActiveTab("preview");
      
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: data.html, pages: data.pages, provider: data.provider })
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
        const script = `
        <script>
          document.addEventListener('click', function(e) {
            const a = e.target.closest('a');
            if (a) {
              const href = a.getAttribute('href');
              if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault();
                window.parent.postMessage({ type: 'NAVIGATE', path: href }, '*');
              }
            }
          });
        </script>
        `;
        let displayHtml = html;
        if (displayHtml.includes('</body>')) {
            displayHtml = displayHtml.replace('</body>', script + '</body>');
        } else {
            displayHtml += script;
        }

        doc.open();
        doc.write(displayHtml);
        doc.close();
      }
    }
  }, [html, loading]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'NAVIGATE' && e.data.path && pages.length > 0) {
        let targetPath = e.data.path;
        // handle absolute relative paths
        if (!targetPath.startsWith('/')) {
            targetPath = '/' + targetPath;
        }
        targetPath = targetPath.split('#')[0].split('?')[0]; 
        
        const targetPage = pages.find(p => p.path === targetPath || p.path === (targetPath.startsWith('/') ? targetPath.substring(1) : targetPath));
        
        if (targetPage) {
          setActivePagePath(targetPage.path);
          setHtml(targetPage.html);
          setEditableCode(formatHtml(targetPage.html));
          setActiveTab('preview');
        } else {
          console.warn('Page not found in pages array:', targetPath);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pages]);

  useEffect(() => {
    if (activeTab === "preview" && editableCode && editableCode !== html) {
      setHtml(editableCode);
    }
  }, [activeTab, editableCode, html]);

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
      <main className="flex h-screen bg-landing-bg items-center justify-center">
        <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-landing-accent/40 w-12 h-12" />
      </main>
    );
  }

  if (error && !html) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-landing-bg px-6 font-dmsans">
        <div className="bg-white border border-landing-border rounded-2xl p-8 max-w-md text-center shadow-landing-md">
          <p className="text-red-500 font-bold mb-6 text-sm">Error: {error}</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-3 bg-landing-ink text-white rounded-full font-bold hover:bg-landing-accent transition-all cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-landing-bg text-landing-ink font-dmsans overflow-hidden">
      {/* ───── Left panel (Workspace) ───── */}
      <aside className="w-80 lg:w-[400px] border-r border-landing-border flex flex-col bg-white/40 backdrop-blur-sm shrink-0">
        <div className="p-6 border-b border-landing-border flex justify-between items-center bg-white/40">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="text-[0.65rem] font-bold text-landing-ink-faint uppercase tracking-[0.2em] hover:text-landing-accent transition-colors cursor-pointer"
          >
            ← Dashboard
          </button>
          <div className="scale-75 origin-right">
            <TextIcon/>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col gap-10 overflow-y-auto">
          {/* Prompt block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-landing-accent animate-pulse shadow-[0_0_8px_rgba(26,23,20,0.4)]"></div>
              <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted">Project Vision</h3>
            </div>
            
            <div className="bg-white/80 border border-landing-border rounded-2xl p-6 shadow-landing-sm hover:shadow-landing-md transition-shadow">
              <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar text-sm text-landing-ink-muted leading-relaxed font-[350] italic">
                "{prompt}"
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="px-3 py-1 bg-landing-bg rounded-lg">
                <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-widest">
                  AI: <span className="text-landing-accent">{provider}</span>
                </span>
              </div>
              <div className="px-3 py-1 bg-landing-bg rounded-lg">
                <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-widest">
                  Date: <span className="text-landing-ink-muted">{new Date(createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-landing-border" />

          {/* Pages */}
          {pages.length > 1 && (
            <>
              <div className="space-y-4">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted">Pages</h3>
                <div className="flex flex-col gap-2">
                  {pages.map((p) => (
                    <button
                      key={p.path}
                      onClick={() => {
                        setActivePagePath(p.path);
                        setHtml(p.html);
                        setEditableCode(p.html);
                        setActiveTab('preview');
                      }}
                      className={`text-left px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activePagePath === p.path
                          ? "bg-landing-ink text-white shadow-landing-md"
                          : "bg-white text-landing-ink-muted hover:bg-landing-bg border border-landing-border"
                      }`}
                    >
                      {p.path}
                      {/* {p.name || p.path} */}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-landing-border" />
            </>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted">Refinement</h3>
            <button
              onClick={regenerate}
              disabled={isRegenerating}
              className="w-full bg-landing-accent text-white font-bold py-4 rounded-full
                         disabled:opacity-40 disabled:cursor-not-allowed shadow-landing-md
                         hover:bg-landing-accent/90 hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-3 cursor-pointer"
            >
              {isRegenerating ? (
                <>
                  <HugeiconsIcon icon={ReloadIcon} className="animate-spin w-4 h-4" />
                  Regenerating...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={ReloadIcon} className="w-4 h-4" />
                  Regenerate Design
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                const p = new URLSearchParams({ prompt: prompt.split('\n\n')[0] });
                router.push(`/new?${p.toString()}`);
              }}
              className="w-full border border-landing-border text-landing-ink-muted font-bold py-4 rounded-full
                         hover:bg-white transition-all text-sm shadow-landing-sm cursor-pointer"
            >
              Start New Concept
            </button>
          </div>

          <div className="h-px bg-landing-border" />

          {/* Sharing */}
          <div className="space-y-4">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted">Public Link</h3>
            <div className="flex items-center gap-2 bg-white border border-landing-border rounded-xl p-2 pl-4 shadow-landing-sm">
              <input 
                type="text" 
                readOnly 
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${id}`}
                className="flex-1 bg-transparent text-xs text-landing-ink-faint outline-none truncate font-[350]"
              />
              <button 
                onClick={copyLink}
                title="Copy Link"
                className="p-3 bg-landing-bg rounded-lg hover:bg-landing-accent hover:text-white transition-all text-landing-ink-muted cursor-pointer"
              >
                {copied ? <HugeiconsIcon icon={CopyCheckIcon} className="w-3.5 h-3.5" /> : <HugeiconsIcon icon={Link01Icon} className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-landing-ink-faint italic px-1 leading-relaxed">Generated pages are public by default. Share this link with your team or clients.</p>
          </div>
        </div>
      </aside>

      {/* ───── Right panel (Canvas) ───── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-landing-border bg-white/80 backdrop-blur-md relative z-[60]">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1.5 mr-4">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]/20 border border-[#ff5f57]/30" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]/20 border border-[#febc2e]/30" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]/20 border border-[#28c840]/30" />
            </div>
            {/* Tabs */}
            <div className="flex bg-landing-bg rounded-full p-1 border border-landing-border">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${
                  activeTab === "preview"
                    ? "bg-white text-landing-ink shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" /> {activeTab === "preview"?"Preview":""}
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${
                  activeTab === "code"
                    ? "bg-white text-landing-ink shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={CodeSimpleIcon} className="w-4 h-4" /> {activeTab === "code"?"Code":""}
              </button>
            </div>
          </div>

          {/* Page Selector (Center) */}
          {pages.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 in-w-sm  bg-landing-bg hover:bg-white border border-landing-border rounded-full px-5 py-2 shadow-landing-sm transition-all hover:shadow-landing-md active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col  items-start gap-0.5">
                    {/* <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-[0.15em] leading-none">Viewing Page</span> */}
                    <span className="text-xs font-bold text-landing-ink leading-none">{activePagePath}</span>
                  </div>
                </div>
                <div className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-landing-ink-muted group-hover:text-landing-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 bg-white/80 backdrop-blur-xl border border-landing-border rounded-2xl shadow-landing-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-landing-border/50 mb-1">
                    <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-widest">Project Sitemap</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {pages.map((p) => (
                      <button
                        key={p.path}
                        onClick={() => {
                          setActivePagePath(p.path);
                          setHtml(p.html);
                          setEditableCode(formatHtml(p.html));
                          setActiveTab('preview');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all group/item ${
                          activePagePath === p.path
                            ? "bg-landing-ink text-white"
                            : "hover:bg-landing-bg text-landing-ink-muted hover:text-landing-ink"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-bold leading-none">{p.path}</span>
                          <span className={`text-[9px] font-medium uppercase tracking-tighter ${activePagePath === p.path ? 'text-white/60' : 'text-landing-ink-faint'}`}>
                            {p.path === "/" ? "Home Page" : "Component"}
                          </span>
                        </div>
                        {activePagePath === p.path && (
                          <div className="w-1.5 h-1.5 rounded-full bg-landing-accent ring-4 ring-landing-accent/20" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Device Toggles (Internal to Preview Tab) */}
          {activeTab === "preview" && (
            <div className="flex bg-landing-bg rounded-full p-1 border border-landing-border ml-4">
              <button
                onClick={() => setPreviewMode("desktop")}
                title="Desktop View"
                className={`p-2 rounded-full transition-all ${
                  previewMode === "desktop"
                    ? "bg-white text-landing-accent shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={Monitor} className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                title="Tablet View"
                className={`p-2 rounded-full transition-all ${
                  previewMode === "tablet"
                    ? "bg-white text-landing-accent shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={TabletIcon} className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                title="Mobile View"
                className={`p-2 rounded-full transition-all ${
                  previewMode === "mobile"
                    ? "bg-white text-landing-accent shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={SmartPhone01Icon} className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-3 ml-auto">
            {/* Download */}
            <button
              onClick={downloadHtml}
              className="bg-landing-bg text-landing-ink-muted border border-landing-border
                         hover:text-white hover:bg-landing-ink px-4 py-2 rounded-full
                         transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-landing-sm"
            >
              <HugeiconsIcon icon={Download01Icon} className="w-4 h-4" />
              <span className="hidden sm:inline">Export HTML</span>
            </button>
            
            {/* Actions based on tab */}
            {activeTab === "code" ? (
              <button
                onClick={copyCode}
                className="bg-landing-accent text-white px-4 py-2 rounded-full
                           transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-landing-md hover:bg-landing-accent/90"
              >
                {copied ? (
                  <HugeiconsIcon icon={CopyCheckIcon} className="w-4 h-4" />
                ) : (
                  <HugeiconsIcon icon={CopyIcon} className="w-4 h-4" />
                )}
                <span>Copy Code</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (iframeRef.current) {
                    const doc = iframeRef.current.contentDocument!;
                    doc.open();
                    doc.write(editableCode || html);
                    doc.close();
                  }
                }}
                className="bg-landing-bg text-landing-ink-muted border border-landing-border
                           hover:bg-white px-4 py-2 rounded-full
                           transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-landing-sm"
              >
                <HugeiconsIcon icon={ReloadIcon} className="w-4 h-4" />
                <span>Refresh View</span>
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 relative overflow-hidden bg-landing-bg">
          {isRegenerating && (
             <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center text-landing-ink">
               <div className="relative mb-6">
                 <div className="w-16 h-16 border-4 border-landing-accent/20 rounded-full" />
                 <div className="absolute inset-0 border-4 border-landing-accent border-t-transparent rounded-full animate-spin" />
               </div>
               <p className="font-instrument text-3xl tracking-tight">Updating masterpiece...</p>
             </div>
          )}
          
          
          {/* Preview tab */}
          <div className={`${activeTab === "preview" ? "flex" : "hidden"} w-full h-full items-center justify-center  bg-landing-bg/50 overflow-auto custom-scrollbar`}>
            <div 
              className={`h-full bg-white shadow-landing-2xl transition-all duration-500 ease-in-out relative
                ${previewMode === 'desktop' ? 'w-full' : ''}
                ${previewMode === 'tablet' ? 'w-[768px]' : ''}
                ${previewMode === 'mobile' ? 'w-[375px]' : ''}
              `}
            >
              {/* Device Frame Decorations for Mobile/Tablet */}
              {previewMode !== 'desktop' && (
                <div className="absolute inset-x-0 -top-6 flex justify-center">
                  <div className="w-20 h-1 bg-landing-border rounded-full" />
                </div>
              )}
              
              <iframe
                ref={iframeRef}
                className="w-full h-full border-none bg-white shadow-landing-2xl"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>

          {/* Code tab */}
          <div className={activeTab === "code" ? "absolute inset-0 flex flex-col bg-[#1A1714]" : "hidden"}>
            <div className="flex-1 flex overflow-hidden">
              <div
                ref={lineNumRef}
                className="select-none text-right pr-6 pl-4 pt-6 pb-6 text-[#4A4541]
                           text-xs leading-6 font-mono border-r border-[#2A2521]
                           bg-[#1A1714] overflow-hidden shrink-0"
              >
                {editableCode.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <textarea
                className="flex-1 bg-transparent text-[#E6E2DF] text-xs leading-6
                           font-mono p-6 outline-none resize-none min-w-0
                           selection:bg-landing-accent/30 overflow-auto"
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

            <div className="flex items-center justify-between px-6 py-3 border-t border-[#2A2521]
                            bg-[#141210] text-[10px] font-bold uppercase tracking-widest text-[#4A4541]">
              <span className="font-mono">
                {editableCode.split("\n").length} lines · {(editableCode.length / 1024).toFixed(1)} KB
              </span>
              {editableCode !== html && (
                <span className="flex items-center gap-2 text-landing-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-landing-accent animate-pulse" />
                  Visual unsynced · Switch to Preview to render
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
