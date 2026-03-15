"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import GenerateForm from "@/components/generate-form";
import Logo from "@/components/logo";
// import { useRouter } from "next/navigation";

// const EXAMPLES = [
//   "An AI tool that writes cold emails for B2B sales teams",
//   "A Notion-like app built for remote engineering teams",
//   "A SaaS platform that automates invoicing for freelancers",
//   "A mobile app that tracks your carbon footprint daily",
// ];

export default function Home() {
  // const [prompt, setPrompt] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  // const router = useRouter();

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  // const handleSubmit = () => {
  //   if (!prompt.trim()) return;
  //   // Pass prompt via URL search params to /new
  //   const params = new URLSearchParams({ prompt });
  //   router.push(`/new?${params.toString()}`);
  // };

  return (
    
    <main className="flex flex-col items-center justify-center min-h-screen py-30 bg-neutral-950 text-neutral-100 px-6">
      {/* Logo + Tagline */}
      <div className="text-center mb-6 flex flex-col items-center">
        <Logo size="lg" className="mb-4" />
        <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 48,
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "#fff",
              }}>
                Build Landing Pages with <span className="font-semibold" style={{color:"#e8ff47",fontFamily: "'DM Mono', monospace" }}>AI</span>
          </h2>
        <p style={{ color: "#444", fontSize: 14, marginBottom: 8,fontFamily: "'DM Mono', monospace" }}>Describe your product. Get a landing page.</p>
         
      </div>

       <GenerateForm/>

      {/* Projects Gallery */}
      {projects.length > 0 && (
        <div className="mt-24 w-full max-w-5xl pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-xs text-neutral-500">{projects.length} generated</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <Link 
                key={p._id} 
                href={`/p/${p._id}`}
                className="group flex flex-col justify-between bg-neutral-900 border border-neutral-800 
                           rounded-xl p-5 hover:border-neutral-700 hover:bg-neutral-800/50 
                           transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                      {p.provider || "gemini"}
                    </span>
                    <span className="text-[10px] text-neutral-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                    {p.prompt}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-800/50 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#e8ff47]/80 group-hover:text-[#e8ff47] transition-colors">
                    View Project
                  </span>
                  <span className="text-neutral-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
