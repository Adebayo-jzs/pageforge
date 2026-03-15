"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import GenerateForm from "@/components/generate-form";
import Logo from "@/components/logo";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import Navbar from "@/components/Navbar";

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
    <div className="min-h-screen bg-[#080808] text-white">
      
       
      {/* Nav */}
      {/* <nav className="flex border-b border-[#1a1a1a] px-4  md:px-8 h-14 sticky top-0 z-50 items-center justify-between bg-background">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          <span className="text-[#333] text-[12px]">|</span>
          <span className="text-[#555] text-[12px]">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0 flex-col">
            <div className="w-7 h-7 rounded-full bg-[#e8ff47] text-black flex items-center justify-center text-[11px] font-bold">
              {session?.user?.name  ?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-[12px] text-[#666]  sm:inline">{session?.user?.name}</span>
          </div>
          <button
            className="btn bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 cursor-pointer rounded-md text-[11px] transition-colors"
            onClick={() => signOut({ callbackUrl: "/login" })} 
          >
            Sign out
          </button>
        </div>
      </nav> */}
      <Navbar/>
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
      {/* <div> */}

        {/* Left — page list */}
        <div className={`w-full transition-all duration-300 overflow-y-auto p-3 md:p-6 ${previewId ? "lg:w-[420px] lg:border-r lg:border-[#1a1a1a]" : "w-full"}`}>
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline p-6 md:p-8 justify-between gap-6 mb-12">
            <h1 className="text-5xl font-bebas tracking-wide text-white leading-none">
                Recent Projects
            </h1>
            <div className="flex items-center gap-3">
                <span className="text-[#444] text-[13px] font-medium">
                    {loading ? "..." : `${pages.length} generated`}
                </span>
                <button
                    className="btn text-black border-none rounded-sm px-5 py-2 text-[12px] bg-[#e8ff47] flex gap-2 items-center font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                    onClick={() => setIsModalOpen(true)}
                >
                    <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />New
                </button>
            </div>
          </div>

          {/* Empty state */}
          {!loading && pages.length === 0 && (
            <div className="border border-dashed border-[#1e1e1e] rounded-xl px-3 py-20 md:py-32 flex flex-col items-center justify-center bg-[#0d0d0d]/50">
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-6 opacity-30 text-white">◈</div>
                <p className="text-neutral-400 text-sm md:text-base mb-2">No projects yet</p>
                <p className="text-neutral-600 text-xs md:text-sm mb-10">Generate your first landing page to see it here</p>
              </div>
              <GenerateForm/>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${previewId ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-[#111] rounded-xl border border-[#1a1a1a] animate-pulse" />
              ))}
            </div>
          )}

          {/* Page cards */}
          {!loading && pages.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${previewId ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6`}>
              {pages.map((page: Page, i: number) => (
                <div
                  key={page._id}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] transition-all duration-200 hover:border-[#e8ff47] cursor-pointer fade-in stagger-${Math.min((i % 5) + 1, 5)}`}
                  onClick={() => handlePreview(page._id)}
                >
                  {/* Visual Preview */}
                  <div className="relative w-full h-[180px] overflow-hidden bg-[#0d0d0d] border-b border-[#1a1a1a]">
                    <iframe
                      srcDoc={page.html}
                      className="w-[400%] h-[400%] border-none origin-top-left scale-[0.25] opacity-80 group-hover:opacity-100 transition-opacity"
                      title={`Preview ${page._id}`}
                      scrolling="no"
                    />
                    <div className="absolute inset-0 z-10" />  
                  </div>

                  {/* Info Section */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${page.provider.toLowerCase() === 'gemini' ? 'text-blue-400' : 'text-neutral-500'}`}>
                        {page.provider}
                      </span>
                      <span className="text-[10px] text-neutral-600 font-medium">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-400 leading-relaxed mb-5 line-clamp-3 flex-1">
                      {page.prompt}
                    </p>

                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[#e8ff47] text-[11px] font-semibold group-hover:underline">
                        View Project
                      </span>
                      <div className="flex items-center gap-3 text-neutral-600">
                         <button
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); handleDownload(page._id, page.prompt); }}
                            title="Download"
                         >
                            <span className="text-lg leading-none">↓</span>
                         </button>
                         <button
                            className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); handleDelete(page._id); }}
                            title="Delete"
                         >
                            <span className="text-lg leading-none">×</span>
                         </button>
                         <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
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
          <div className="fixed inset-0 bg-black/95 z-[1000] flex flex-col animate-in fade-in duration-200">
            {/* Overlay header */}
            <div className="px-4 md:px-8 py-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#080808]">
              <div className="flex items-center gap-4 overflow-hidden">
                 <div className="hidden sm:flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                 </div>
                 <span className="text-[13px] text-neutral-500 font-medium truncate max-w-[200px] md:max-w-md">
                    {pages.find((p: Page) => p._id === previewId)?.prompt}
                 </span>
              </div>
              <button
                className="btn bg-[#1a1a1a] border-none text-white px-6 py-2 rounded-lg text-xs font-semibold hover:bg-[#252525] transition-colors"
                onClick={() => setPreviewId(null)}
              >
                Close Preview
              </button>
            </div>

            {/* iframe */}
            <div className="flex-1 relative bg-white overflow-hidden">
              {previewLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 bg-[#080808]">
                  <div className="w-8 h-8 border-3 border-[#e8ff47] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12px] text-neutral-500">Rendering...</span>
                </div>
              ) : (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-none"
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
 