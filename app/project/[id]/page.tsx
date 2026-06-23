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
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import TextIcon from "@/components/texticon";
import ProjectSettings from "@/components/ProjectSettings";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";

type Tab = "preview" | "code";

function formatHtml(html: string) {
  let formatted = "";
  let indent = 0;
  const tab = "  ";
  const cleanHtml = html.replace(/>\s+</g, "><").trim();

  cleanHtml.split(/(?=<)/g).forEach((node) => {
    if (node.startsWith("</")) {
      indent--;
      formatted += tab.repeat(indent) + node + "\n";
    } else if (
      node.startsWith("<") &&
      !node.startsWith("<!") &&
      !node.endsWith("/>") &&
      !node.includes("</")
    ) {
      const isSelfClosing =
        /<(br|hr|img|input|link|meta|area|base|col|embed|param|source|track|wbr)[^>]*>/i.test(
          node
        );
      formatted += tab.repeat(indent) + node + "\n";
      if (!isSelfClosing) indent++;
    } else {
      formatted += tab.repeat(indent) + node + "\n";
    }
  });
  return formatted.trim();
}

export default function Workspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({});
  const [projectType, setProjectType] = useState<"html" | "react">("html");
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Settings states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [domainVerified, setDomainVerified] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"live" | "paused" | "draft">("draft");
  const [lastDeployedAt, setLastDeployedAt] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

        const homePage =
          projectPages.length > 0
            ? projectPages.find(
                (p: any) => p.path === "/" || p.path === "index.html"
              ) || projectPages[0]
            : null;
        const homePath = homePage ? homePage.path : "/";
        const homeHtml = data.html || (homePage?.html || "");

        setProjectType(data.type || "html");
        setPrompt(data.prompt || "");
        setActivePagePath(homePath);

        if (data.type === "react") {
          let files = data.files || {};
          if (Array.isArray(files)) {
            files = files.reduce((acc: any, file: any) => {
              acc[file.path] = file.content;
              return acc;
            }, {});
          }
          setProjectFiles(files);
          const reactCode = homePage?.reactCode || "";
          if (Object.keys(files).length === 0 && reactCode) {
            setProjectFiles({ "/App.tsx": reactCode });
          }
          setHtml("");
          setEditableCode("");
        } else {
          setHtml(homeHtml || "");
          setEditableCode(formatHtml(homeHtml || ""));
        }

        setProvider(data.provider || "gemini");
        setCreatedAt(data.createdAt || "");
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCustomDomain(data.customDomain || "");
        setDomainVerified(data.domainVerified || false);
        setDeploymentStatus(data.deploymentStatus || "draft");
        setLastDeployedAt(data.lastDeployedAt || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const applyEdit = async () => {
    if (!editPrompt.trim() || isEditing) return;
    setIsEditing(true);
    setEditError("");
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, instruction: editPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Edit failed");
      setHtml(data.html);
      setEditableCode(formatHtml(data.html));
      setActiveTab("preview");
      setEditPrompt("");
      // Persist the updated HTML
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: data.html }),
      });
    } catch (e: any) {
      setEditError(e.message);
    } finally {
      setIsEditing(false);
    }
  };

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
      if (data.type === "react") {
        let files = data.files || {};
        if (Array.isArray(files)) {
          files = files.reduce((acc: any, file: any) => {
            acc[file.path] = file.content;
            return acc;
          }, {});
        }
        setProjectFiles(files);
      } else {
        const newHomeHtml =
          data.pages && data.pages.length > 0
            ? data.pages.find(
                (p: any) => p.path === "/" || p.path === "index.html"
              )?.html || data.pages[0]?.html
            : data.html;
        setHtml(newHomeHtml || data.html);
        setEditableCode(formatHtml(newHomeHtml || data.html || ""));
      }
      setActivePagePath("/");
      setProvider(data.provider);
      setActiveTab("preview");

      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: data.html,
          pages: data.pages,
          provider: data.provider,
        }),
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
        <\/script>
        `;
        let displayHtml = html;
        if (displayHtml.includes("</body>")) {
          displayHtml = displayHtml.replace("</body>", script + "</body>");
        } else {
          displayHtml += script;
        }
        doc.open();
        doc.write(displayHtml);
        doc.close();
      }
    }
  }, [html, loading, refreshKey]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "NAVIGATE" && e.data.path && pages.length > 0) {
        let targetPath = e.data.path;
        if (!targetPath.startsWith("/")) targetPath = "/" + targetPath;
        targetPath = targetPath.split("#")[0].split("?")[0];
        const targetPage = pages.find(
          (p) =>
            p.path === targetPath ||
            p.path ===
              (targetPath.startsWith("/")
                ? targetPath.substring(1)
                : targetPath)
        );
        if (targetPage) {
          setActivePagePath(targetPage.path);
          setHtml(targetPage.html);
          setEditableCode(formatHtml(targetPage.html));
          setActiveTab("preview");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
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



  if (loading) {
    return (
      <main className="flex h-screen bg-landing-bg items-center justify-center">
        <HugeiconsIcon
          icon={ReloadIcon}
          className="animate-spin text-landing-accent/40 w-12 h-12"
        />
      </main>
    );
  }

  if (error && !html) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-landing-bg px-6 font-dmsans">
        <div className="bg-white border border-landing-border rounded-2xl p-8 max-w-md text-center shadow-landing-md">
          <p className="text-red-500 font-bold mb-6 text-sm">
            Error: {error}
          </p>
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

  // Sandpack files with fallback
  const sandpackFiles =
    Object.keys(projectFiles).length > 0
      ? projectFiles
      : { "/App.tsx": "export default function App() { return <div>Building project...</div> }" };

  return (
    <main className="flex h-screen bg-landing-bg text-landing-ink font-dmsans overflow-hidden">
      {/* ───── Left panel ───── */}
      <aside className="w-80 lg:w-[400px] border-r border-landing-border flex flex-col bg-white/40 backdrop-blur-sm shrink-0">
        <div className="p-6 border-b border-landing-border flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[0.65rem] font-bold text-landing-ink-faint uppercase tracking-[0.2em] hover:text-landing-accent transition-colors cursor-pointer"
            >
              ← Dashboard
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-landing-border" />
            <button
              onClick={() => setShowSettings(true)}
              title="Project Settings"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-landing-bg hover:bg-landing-border/60 text-landing-ink-muted hover:text-landing-ink transition-all cursor-pointer font-bold text-[10px] uppercase tracking-wider"
            >
              <svg className="w-3.5 h-3.5 animate-[spin_8s_linear_infinite] hover:animate-[spin_2s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
          <div className="scale-75 origin-right">
            <TextIcon />
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col gap-10 overflow-y-auto">
          {/* Prompt block */}
          <div className="space-y-4">
             
            <div className="bg-white/80 border border-landing-border rounded-2xl p-6 shadow-landing-sm hover:shadow-landing-md transition-shadow">
              <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar text-sm text-landing-ink-muted leading-relaxed font-[350] italic">
                &quot;{prompt}&quot;
              </div>
            </div>
            {/* <div className="flex flex-wrap gap-4 pt-1">
              <div className="px-3 py-1 bg-landing-bg rounded-lg">
                <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-widest">
                  AI:{" "}
                  <span className="text-landing-accent">{provider}</span>
                </span>
              </div>
              <div className="px-3 py-1 bg-landing-bg rounded-lg">
                <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-widest">
                  Date:{" "}
                  <span className="text-landing-ink-muted">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div> */}
          </div>

          {/* <div className="h-px bg-landing-border" /> */}

          {/* Pages */}
          {/* {pages.length > 1 && (
            <>
              <div className="space-y-4">
                <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted">
                  Pages
                </h3>
                <div className="flex flex-col gap-2">
                  {pages.map((p) => (
                    <button
                      key={p.path}
                      onClick={() => {
                        setActivePagePath(p.path);
                        if (projectType === "html") {
                          setHtml(p.html);
                          setEditableCode(formatHtml(p.html));
                        }
                        setActiveTab("preview");
                      }}
                      className={`text-left px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activePagePath === p.path
                          ? "bg-landing-ink text-white shadow-landing-md"
                          : "bg-white text-landing-ink-muted hover:bg-landing-bg border border-landing-border"
                      }`}
                    >
                      {p.path}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-landing-border" />
            </>
          )} */}

          {/* Actions */}
          

          <div className="h-px bg-landing-border" />

          {/* Sharing / Deployment */}
          <div className="space-y-4">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted flex items-center justify-between">
              <span>Public Live Site</span>
              {deploymentStatus !== "draft" && (
                <span className={`w-1.5 h-1.5 rounded-full ${deploymentStatus === "live" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              )}
            </h3>
            {deploymentStatus === "draft" || (!slug && !customDomain) ? (
              <div className="bg-landing-bg/50 border border-dashed border-landing-border rounded-2xl p-4 text-center space-y-3">
                <p className="text-[11px] text-landing-ink-faint italic leading-relaxed">
                  This project is currently a draft and has not been published yet.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full py-2 bg-landing-ink text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-landing-accent transition-all cursor-pointer shadow-landing-sm"
                >
                  Configure &amp; Publish
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 bg-white border border-landing-border rounded-xl p-2 pl-4 shadow-landing-sm">
                  <input
                    type="text"
                    readOnly
                    value={customDomain && domainVerified ? `https://${customDomain}` : `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}`}
                    className="flex-1 bg-transparent text-xs text-landing-ink outline-none truncate font-mono"
                  />
                  <button
                    onClick={async () => {
                      const url = customDomain && domainVerified ? `https://${customDomain}` : `${window.location.origin}/${slug}`;
                      await navigator.clipboard.writeText(url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    title="Copy Live URL"
                    className="p-3 bg-landing-bg rounded-lg hover:bg-landing-accent hover:text-white transition-all text-landing-ink-muted cursor-pointer"
                  >
                    {copied ? (
                      <HugeiconsIcon icon={CopyCheckIcon} className="w-3.5 h-3.5" />
                    ) : (
                      <HugeiconsIcon icon={Link01Icon} className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[9px] text-landing-ink-faint italic px-1 leading-relaxed">
                  {deploymentStatus === "paused" 
                    ? "Deployment is currently paused. Visitors will see a paused message." 
                    : "Your site is live! Anyone with this link can view your published design."}
                </p>
              </>
            )}
          </div>
          <div className="space-y-4">
            {/* <h3 className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-ink-muted">
              Refinement
            </h3>
            <button
              onClick={regenerate}
              disabled={isRegenerating}
              className="w-full bg-landing-accent text-white font-bold py-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed shadow-landing-md hover:bg-landing-accent/90 hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-3 cursor-pointer"
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
            </button> */}
            {/* Edit with Prompt */}
            <div className="space-y-2 pt-1 fixed bottom-0 right-0 left-0 p-2">
              {editError && (
                <p className="text-[10px] text-red-500 px-1">{editError}</p>
              )}
              {projectType === "react" && (
                <p className="text-[10px] text-landing-ink-faint italic px-1">
                  Prompt editing is available for HTML projects only.
                </p>
              )}
              <div className="relative">
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      applyEdit();
                    }
                  }}
                  placeholder="Describe a change… e.g. Make the hero background dark blue"
                  rows={3}
                  disabled={isEditing || projectType === "react"}
                  className="w-full bg-white border border-landing-border rounded-2xl px-4 pt-3 pb-10 text-sm text-landing-ink placeholder:text-landing-ink-faint outline-none resize-none leading-relaxed shadow-landing-sm focus:border-landing-accent/50 focus:shadow-landing-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  onClick={applyEdit}
                  disabled={isEditing || !editPrompt.trim() || projectType === "react"}
                  title={projectType === "react" ? "Prompt editing is for HTML projects" : "Apply edit (Enter)"}
                  className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-landing-ink text-white text-[11px] font-bold rounded-full transition-all hover:bg-landing-accent disabled:opacity-30 disabled:cursor-not-allowed shadow-landing-sm cursor-pointer"
                >
                  {isEditing ? (
                    <HugeiconsIcon icon={ReloadIcon} className="w-3 h-3 animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={SparklesIcon} className="w-3 h-3" />
                  )}
                  {isEditing ? "Applying…" : "Apply"}
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </aside>

      {/* ───── Right panel (Canvas) ───── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-landing-border bg-white/80 backdrop-blur-md relative z-[60] shrink-0">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1.5 mr-4">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]/20 border border-[#ff5f57]/30" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]/20 border border-[#febc2e]/30" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]/20 border border-[#28c840]/30" />
            </div>
            <div className="flex bg-landing-bg rounded-full p-1 border border-landing-border">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${
                  activeTab === "preview"
                    ? "bg-white text-landing-ink shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" />
                {activeTab === "preview" ? "Preview" : ""}
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${
                  activeTab === "code"
                    ? "bg-white text-landing-ink shadow-landing-sm"
                    : "text-landing-ink-faint hover:text-landing-ink"
                }`}
              >
                <HugeiconsIcon icon={CodeSimpleIcon} className="w-4 h-4" />
                {activeTab === "code" ? "Code" : ""}
              </button>
            </div>
          </div>

          {/* Page selector (center) */}
          {pages.length > 0 && (
            <div
              className="absolute left-1/2 -translate-x-1/2 hidden md:block"
              ref={dropdownRef}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-landing-bg hover:bg-white border border-landing-border rounded-full px-5 py-2 shadow-landing-sm transition-all hover:shadow-landing-md active:scale-[0.98] cursor-pointer group"
              >
                <span className="text-xs font-bold text-landing-ink leading-none">
                  {activePagePath}
                </span>
                <div
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <svg
                    className="w-4 h-4 text-landing-ink-muted group-hover:text-landing-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 bg-white/80 backdrop-blur-xl border border-landing-border rounded-2xl shadow-landing-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-landing-border/50 mb-1">
                    <span className="text-[10px] text-landing-ink-faint font-bold uppercase tracking-widest">
                      Project Sitemap
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {pages.map((p) => (
                      <button
                        key={p.path}
                        onClick={() => {
                          setActivePagePath(p.path);
                          if (projectType === "html") {
                            setHtml(p.html);
                            setEditableCode(formatHtml(p.html));
                          }
                          setActiveTab("preview");
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all ${
                          activePagePath === p.path
                            ? "bg-landing-ink text-white"
                            : "hover:bg-landing-bg text-landing-ink-muted hover:text-landing-ink"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-bold leading-none">
                            {p.path}
                          </span>
                          <span
                            className={`text-[9px] font-medium uppercase tracking-tighter ${
                              activePagePath === p.path
                                ? "text-white/60"
                                : "text-landing-ink-faint"
                            }`}
                          >
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

          {/* Device toggles */}
          {activeTab === "preview" && (
            <div className="flex bg-landing-bg rounded-full p-1 border border-landing-border ml-4">
              {(
                [
                  { mode: "desktop", icon: Monitor, title: "Desktop View" },
                  { mode: "tablet", icon: TabletIcon, title: "Tablet View" },
                  { mode: "mobile", icon: SmartPhone01Icon, title: "Mobile View" },
                ] as const
              ).map(({ mode, icon, title }) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  title={title}
                  className={`p-2 rounded-full transition-all ${
                    previewMode === mode
                      ? "bg-white text-landing-accent shadow-landing-sm"
                      : "text-landing-ink-faint hover:text-landing-ink"
                  }`}
                >
                  <HugeiconsIcon icon={icon} className="w-4 h-4" />
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 ml-auto">
             

            {activeTab === "code" ? (
              <button
                onClick={copyCode}
                className="bg-landing-accent text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-landing-md hover:bg-landing-accent/90"
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
                onClick={() => setRefreshKey((k) => k + 1)}
                className="bg-landing-bg text-landing-ink-muted border border-landing-border hover:bg-white px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-landing-sm"
              >
                <HugeiconsIcon icon={ReloadIcon} className="w-4 h-4" />
                <span>Refresh View</span>
              </button>
            )}
          </div>
        </div>

        {/* ───── Content area ───── */}
        <div className="flex-1 relative overflow-hidden bg-landing-bg min-h-0">
          {/* Regenerating overlay */}
          {isRegenerating && (
            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center text-landing-ink">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-landing-accent/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-landing-accent border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="font-instrument text-3xl tracking-tight">
                Updating masterpiece...
              </p>
            </div>
          )}

          {/* ── React project: Sandpack ── */}
          {projectType === "react" && (
            <div className="absolute inset-0 flex flex-col">
              <SandpackProvider
                template="react-ts"
                theme="light"
                files={sandpackFiles}
                customSetup={{
                  dependencies: {
                    "lucide-react": "0.344.0",
                    "framer-motion": "11.0.0",
                    "react-router-dom": "6.22.0",
                  },
                }}
                options={{
                  externalResources: [
                    "https://unpkg.com/@tailwindcss/browser@4",
                  ],
                }}
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
              >
                {/*
                 * SandpackLayout must always be mounted so Sandpack's internal
                 * context (bundler, file system) stays alive. We toggle
                 * visibility of each panel via CSS, never by unmounting.
                 */}
                <SandpackLayout style={{ flex: 1, minHeight: 0, border: "none" }}>
                  {/* Code view — file explorer + editor */}
                  <div
                    style={{
                      display: activeTab === "code" ? "flex" : "none",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 220,
                        flexShrink: 0,
                        height: "100%",
                        overflowY: "auto",
                        backgroundColor:"white",
                        borderRight: "1px solid var(--sp-colors-surface2)",
                      }}
                    >
                      <SandpackFileExplorer autoHiddenFiles={false} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column" }}>
                      <SandpackCodeEditor
                        showTabs
                        closableTabs
                        showInlineErrors
                        showLineNumbers
                        style={{ flex: 1, minHeight: 0 }}
                      />
                    </div>
                  </div>

                  {/* Preview view */}
                  <SandpackPreview
                    showNavigator={false}
                    showOpenInCodeSandbox={false}
                    showRefreshButton={false}
                    style={{
                      display: activeTab === "preview" ? "flex" : "none",
                      flex: 1,
                      height: "100%",
                      minHeight: 0,
                    }}
                  />
                </SandpackLayout>
              </SandpackProvider>
            </div>
          )}

          {/* ── HTML project ── */}
          {projectType === "html" && (
            <>
              {/* Preview tab */}
              <div
                className={`${
                  activeTab === "preview" ? "flex" : "hidden"
                } absolute inset-0 items-center justify-center overflow-auto custom-scrollbar bg-landing-bg/50`}
              >
                {/*
                 * Device frame: full width on desktop, fixed width on
                 * tablet/mobile. overflow-hidden prevents the iframe from
                 * bleeding outside the rounded corners.
                 */}
                <div
                  className={`
                    relative h-full bg-white shadow-landing-2xl transition-all duration-500 ease-in-out overflow-hidden
                    ${previewMode === "desktop" ? "w-full" : ""}
                    ${previewMode === "tablet" ? "w-[768px] my-4 rounded-2xl" : ""}
                    ${previewMode === "mobile" ? "w-[375px] my-4 rounded-2xl" : ""}
                  `}
                >
                  {previewMode !== "desktop" && (
                    <div className="absolute inset-x-0 -top-6 flex justify-center pointer-events-none">
                      <div className="w-20 h-1 bg-landing-border rounded-full" />
                    </div>
                  )}
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>

              {/* Code tab */}
              <div
                className={`${
                  activeTab === "code" ? "absolute inset-0 flex flex-col" : "hidden"
                } bg-[#1A1714]`}
              >
                <div className="flex-1 flex overflow-hidden min-h-0">
                  <div
                    ref={lineNumRef}
                    className="select-none text-right pr-6 pl-4 pt-6 pb-6 text-[#4A4541] text-xs leading-6 font-mono border-r border-[#2A2521] bg-[#1A1714] overflow-hidden shrink-0"
                  >
                    {editableCode.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    className="flex-1 bg-transparent text-[#E6E2DF] text-xs leading-6 font-mono p-6 outline-none resize-none min-w-0 selection:bg-landing-accent/30 overflow-auto"
                    value={editableCode}
                    onChange={(e) => setEditableCode(e.target.value)}
                    onScroll={(e) => {
                      if (lineNumRef.current) {
                        lineNumRef.current.scrollTop =
                          e.currentTarget.scrollTop;
                      }
                    }}
                    spellCheck={false}
                    wrap="off"
                  />
                </div>

                <div className="flex items-center justify-between px-6 py-3 border-t border-[#2A2521] bg-[#141210] text-[10px] font-bold uppercase tracking-widest text-[#4A4541] shrink-0">
                  <span className="font-mono">
                    {editableCode.split("\n").length} lines ·{" "}
                    {(editableCode.length / 1024).toFixed(1)} KB
                  </span>
                  {editableCode !== html && (
                    <span className="flex items-center gap-2 text-landing-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-landing-accent animate-pulse" />
                      Visual unsynced · Switch to Preview to render
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showSettings && (
        <ProjectSettings
          projectId={id}
          initialTitle={title}
          initialSlug={slug}
          initialCustomDomain={customDomain}
          initialDomainVerified={domainVerified}
          initialDeploymentStatus={deploymentStatus}
          initialLastDeployedAt={lastDeployedAt}
          onClose={() => setShowSettings(false)}
          onProjectDeleted={() => router.push("/dashboard")}
          onSettingsUpdate={(updated) => {
            if (updated.slug !== undefined) setSlug(updated.slug);
            if (updated.customDomain !== undefined) setCustomDomain(updated.customDomain);
            if (updated.domainVerified !== undefined) setDomainVerified(updated.domainVerified);
            if (updated.deploymentStatus !== undefined) setDeploymentStatus(updated.deploymentStatus);
            if (updated.lastDeployedAt !== undefined) setLastDeployedAt(updated.lastDeployedAt);
          }}
        />
      )}
    </main>
  );
} 