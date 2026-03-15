"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { transition: border-color 0.2s, transform 0.2s; }
        .card:hover { border-color: #e8ff47 !important; transform: translateY(-1px); }
        .btn { transition: all 0.15s; cursor: pointer; }
        .btn:hover { opacity: 0.8; }
        .btn:active { transform: scale(0.97); }
        .fade-in { animation: fadeIn 0.4s ease forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }
        .stagger-5 { animation-delay: 0.25s; }
        .provider-gemini { color: #888; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        .provider-openai { color: #888; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .thumbnail-container {
          width: 100%;
          height: 180px;
          overflow: hidden;
          position: relative;
          background: #0d0d0d;
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #1a1a1a;
        }
        .thumbnail-iframe {
          width: 400%;
          height: 400%;
          border: none;
          transform: scale(0.25);
          transform-origin: 0 0;
          pointer-events: none;
          opacity: 0.8;
          transition: opacity 0.3s;
          overflow: hidden !important;
        }
        .card:hover .thumbnail-iframe { opacity: 1; }
        
        /* Hide all scrollbars (scrollkit) */
        ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "0 32px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "#080808",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.05em", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Page<span style={{ color: "#e8ff47" }}>Forge</span>
          </span>
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
            <span style={{ fontSize: 12, color: "#666" }}>{session?.user?.email}</span>
          </div>
          <button
            className="btn"
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              background: "transparent",
              border: "1px solid #222",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#555",
              fontSize: 11,
              fontFamily: "inherit",
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>

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
                    className="btn"
                    onClick={() => router.push("/")}
                    style={{
                        background: "#e8ff47",
                        color: "#000",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 20px",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        letterSpacing: "0.03em",
                    }}
                >
                    + New
                </button>
            </div>
          </div>

          {/* Empty state */}
          {!loading && pages.length === 0 && (
            <div style={{
              border: "1px dashed #1e1e1e",
              borderRadius: 16,
              padding: "64px 32px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◈</div>
              <p style={{ color: "#444", fontSize: 14, marginBottom: 8 }}>No pages yet</p>
              <p style={{ color: "#333", fontSize: 12 }}>Generate your first landing page to see it here</p>
              <button
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
              </button>
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
      </div>
    </div>
  );
}