"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import GenerateForm from "@/components/generate-form";
import Logo from "@/components/logo";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

type Page = {
  _id: string;
  prompt: string;
  provider: string;
  createdAt: string;
  html?: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        // The API returns a flat array of projects
        setPages(Array.isArray(data) ? data : (data.pages ?? []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setPages((prev: Page[]) => prev.filter((p: Page) => p._id !== id));
    setDeleting(null);
    if (previewId === id) setPreviewId(null);
  };

  const handlePreview = async (id: string) => {
    if (previewId === id) {
      setPreviewId(null);
      return;
    }
    setPreviewId(id);
    setPreviewLoading(true);
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    setPreviewHtml(data.html ?? "");
    setPreviewLoading(false);
  };

  const handleDownload = async (id: string, prompt: string) => {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    const blob = new Blob([data.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prompt.slice(0, 30).replace(/\s+/g, "-")}.html`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
      
       
      {/* Nav */}
      <nav className="hiddden border-b-1 border-[#1a1a1a] px-8 h-14 flex sticky top-0 z-50 items-center justify-between bg-background" style={{ 
        padding: "0 32px", 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Logo size="sm" />
          <span style={{ color: "#333", fontSize: 12 }}>|</span>
          <span style={{ color: "#555", fontSize: 12 }}>Dashboard</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#e8ff47", color: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
            }}>
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span style={{ fontSize: 12, color: "#666" }}>{session?.user?.name}</span>
          </div>
          <button
            className="btn bg-red-600 text-white px-3 py-2 cursor-pointer rounded-md text-[11px] "
            onClick={() => signOut({ callbackUrl: "/login" })} 
          >
            Sign out
          </button>
        </div>
      </nav>
      
      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
      {/* <div> */}

        {/* Left — page list */}
        <div style={{
          width: previewId ? 420 : "100%",
          borderRight: previewId ? "1px solid #1a1a1a" : "none",
          overflowY: "auto",
          padding: 32,
          transition: "width 0.3s ease",
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 48 }}>
            <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 48,
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "#fff",
              }}>
                Recent Projects
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#444", fontSize: 13, fontWeight: 500 }}>
                    {loading ? "..." : `${pages.length} generated`}
                </span>
                <button
                    className="btn text-[#000] border-none rounded-sm px-5 py-2 text-[12px] bg-[#e8ff47] flex gap-2 items-center font-semibold cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                    style={{ 
                        fontFamily: "inherit",
                        letterSpacing: "0.03em",
                    }}
                >
                    <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />New
                </button>
            </div>
          </div>

          {/* Empty state */}
          {!loading && pages.length === 0 && (
            <div 
              className="border-1 border-dashed border-[#1e1e1e] rounded-xl px-8 py-16 flex flex-col items-center justify-center"
             >
              <div className="text-center mb-4">

              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◈</div>
              <p style={{ color: "#444", fontSize: 14, marginBottom: 8 }}>No pages yet</p>
              <p style={{ color: "#333", fontSize: 12 }}>Generate your first landing page to see it here</p>
              </div>
              {/* <button
                className="btn"
                onClick={() => router.push("/")}
                style={{
                  marginTop: 24,
                  background: "#e8ff47",
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                Generate a page
              </button> */}
              <GenerateForm/>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="card-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{
                  height: 320,
                  background: "#111",
                  borderRadius: 12,
                  border: "1px solid #1a1a1a",
                  animation: "pulse 1.5s ease-in-out infinite",
                }} />
              ))}
              <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
            </div>
          )}

          {/* Page cards */}
          {!loading && pages.length > 0 && (
            <div className="card-grid">
              {pages.map((page: Page, i: number) => (
                <div
                  key={page._id}
                  className={`card fade-in stagger-${Math.min((i % 5) + 1, 5)}`}
                  style={{
                    background: "#0d0d0d",
                    border: `1px solid #1a1a1a`,
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => handlePreview(page._id)}
                >
                  {/* Visual Preview */}
                  <div className="thumbnail-container">
                    <iframe
                      srcDoc={page.html}
                      className="thumbnail-iframe"
                      title={`Preview ${page._id}`}
                      scrolling="no"
                    />
                    <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />  
                  </div>

                  {/* Info Section */}
                  <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span className={`provider-${page.provider.toLowerCase()}`}>
                        {page.provider}
                      </span>
                      <span style={{ fontSize: 10, color: "#444", fontWeight: 500 }}>
                        {new Date(page.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p style={{
                      fontSize: 14,
                      color: "#aaa",
                      lineHeight: 1.5,
                      marginBottom: 20,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      flex: 1,
                    }}>
                      {page.prompt}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                      <span style={{ color: "#e8ff47", fontSize: 11, fontWeight: 600 }}>
                        View Project
                      </span>
                      <div style={{ color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
                         <button
                            className="btn"
                            onClick={(e) => { e.stopPropagation(); handleDownload(page._id, page.prompt); }}
                            title="Download"
                            style={{ background: "transparent", border: "none", color: "#444", fontSize: 14 }}
                         >
                            ↓
                         </button>
                         <button
                            className="btn"
                            onClick={(e) => { e.stopPropagation(); handleDelete(page._id); }}
                            title="Delete"
                            style={{ background: "transparent", border: "none", color: "#444", fontSize: 14 }}
                         >
                            ×
                         </button>
                         <span style={{ fontSize: 16 }}>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full-screen preview overlay */}
        {previewId && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.2s ease",
          }}>
            {/* Overlay header */}
            <div style={{
              padding: "16px 32px",
              borderBottom: "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#080808",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                 <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                 </div>
                 <span style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>
                    {pages.find((p: Page) => p._id === previewId)?.prompt.slice(0, 80)}...
                 </span>
              </div>
              <button
                className="btn"
                onClick={() => setPreviewId(null)}
                style={{
                  background: "#1a1a1a",
                  border: "none",
                  color: "#fff",
                  padding: "8px 24px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Close Preview
              </button>
            </div>

            {/* iframe */}
            <div style={{ flex: 1, position: "relative", background: "#fff" }}>
              {previewLoading ? (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  color: "#333", gap: 12,
                  background: "#080808",
                }}>
                  <div style={{
                    width: 32, height: 32,
                    border: "3px solid #e8ff47",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }} />
                  <span style={{ fontSize: 12, color: "#555" }}>Rendering...</span>
                </div>
              ) : (
                <iframe
                  srcDoc={previewHtml}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="Page preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          </div>
        )}

        {/* Modal Overlay for New Project */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <div className="w-full max-w-2xl bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer text-2xl"
              >
                ×
              </button>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>Create New Project</h2>
                <p className="text-sm text-neutral-400">Describe what you want to build and PageForge will generate it for you.</p>
              </div>
              <GenerateForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 