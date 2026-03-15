"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
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
  const { data: session } = useSession();
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
    <>
    <Navbar/>
    <main className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e8ff47]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[90vh] pt-20 pb-32 px-6 w-full max-w-7xl">
      {/* Logo + Tagline */}
          <Logo size="xl" className="mb-6 animate-in fade-in zoom-in duration-700" />
          <h1 className="text-6xl md:text-9xl font-bebas tracking-tighter text-white mb-6 leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            BUILD LANDING PAGES<br />
            WITH <span className="text-[#e8ff47]">AI</span>
          </h1>
          <p className="font-mono text-sm md:text-base text-neutral-500 tracking-widest uppercase mb-12 animate-in fade-in duration-700 delay-200">
            Describe your product. Get a premium landing page. In seconds.
          </p>

          {session && (
            <Link 
              href="/dashboard"
              className="mb-12 group flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-8 py-4 rounded-full hover:border-[#e8ff47] transition-all animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-[#e8ff47]">Go to Dashboard</span>
              <span className="text-[#e8ff47] group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
          
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <GenerateForm />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 w-full max-w-7xl border-t border-neutral-900">
          <div className="flex flex-col md:flex-row gap-12 items-baseline mb-20">
            <h2 className="text-5xl font-bebas text-white shrink-0">CORE CAPABILITIES</h2>
            <div className="h-px w-full bg-neutral-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "AI-DRIVEN LAYOUTS", desc: "Context-aware designs generated specifically for your unique product description.", icon: "◈" },
              { title: "PREMIUM COMPONENTS", desc: "Hand-crafted, glassmorphic elements that give your site a state-of-the-art feel.", icon: "✧" },
              { title: "INSTANT EXPORT", desc: "Download high-quality, clean code (HTML/Tailwind) ready for immediate deployment.", icon: "↯" },
              { title: "RESPONSIVE BY DEFAULT", desc: "Pixel-perfect layouts that look stunning on mobile, tablet, and desktop.", icon: "⇲" },
            ].map((f, i) => (
              <div key={i} className="group p-8 bg-neutral-900/40 border border-neutral-800 rounded-2xl hover:border-[#e8ff47]/50 transition-all">
                <span className="text-2xl text-[#e8ff47] mb-6 block">{f.icon}</span>
                <h3 className="text-xl font-bebas text-white mb-4 tracking-wide">{f.title}</h3>
                <p className="font-mono text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-32 px-6 w-full max-w-7xl bg-[#e8ff47] text-black rounded-[40px] mb-32 mx-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-bebas leading-[0.9] mb-8">FROM IDEA TO<br />LAUNCH IN 3 STEPS</h2>
              <p className="font-mono text-sm uppercase tracking-wider opacity-60">Simple. Fast. Powerful.</p>
            </div>
            <div className="space-y-12">
              {[
                { step: "01", title: "DESCRIBE", desc: "Type a few sentences about your product, audience, and goal." },
                { step: "02", title: "GENERATE", desc: "Our AI engine constructs a custom, high-converting landing page." },
                { step: "03", title: "DEPLOY", desc: "Preview your result, download the source, and hit live." },
              ].map((s, i) => (
                <div key={i} className="flex gap-8 group">
                  <span className="text-4xl font-bebas opacity-20 group-hover:opacity-100 transition-opacity">{s.step}</span>
                  <div>
                    <h3 className="text-2xl font-bebas mb-2">{s.title}</h3>
                    <p className="text-sm font-medium leading-relaxed opacity-70">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Projects Gallery */}
        {projects.length > 0 && (
          <section className="py-32 px-6 w-full max-w-7xl border-t border-neutral-900">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-4xl font-bebas text-white tracking-wide shrink-0">COMMUNITY SHOWCASE</h2>
              <div className="h-px flex-1 bg-neutral-900" />
              <span className="font-mono text-[10px] text-neutral-600 tracking-widest uppercase">{projects.length} GENERATED</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => (
                <Link 
                  key={p._id} 
                  href={`/p/${p._id}`}
                  className="group flex flex-col justify-between bg-neutral-900/40 border border-neutral-800 
                             rounded-2xl p-6 hover:border-[#e8ff47]/30 hover:bg-neutral-900 
                             transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800/50">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#e8ff47] font-semibold">
                        {p.provider || "gemini"}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-600">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 line-clamp-4 leading-relaxed font-mono">
                      {p.prompt}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-[#e8ff47] transition-colors">
                      EXPLORE PROJECT
                    </span>
                    <span className="text-[#e8ff47] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="w-full py-20 px-6 border-t border-neutral-900 flex flex-col items-center">
          <Logo size="md" className="mb-8 opacity-50 hover:opacity-100 transition-opacity" />
          <nav className="flex gap-8 mb-12">
            <Link href="/policy" className="font-mono text-[10px] tracking-widest text-neutral-500 hover:text-[#e8ff47] transition-colors uppercase">Privacy Policy</Link>
            {/* <Link href="/dashboard" className="font-mono text-[10px] tracking-widest text-neutral-500 hover:text-[#e8ff47] transition-colors uppercase">Dashboard</Link> */}
            <a href="https://x.com/theebayo" target="_blank" className="font-mono text-[10px] tracking-widest text-neutral-500 hover:text-[#e8ff47] transition-colors uppercase">Twitter</a>
          </nav>
          <p className="font-mono text-[9px] text-neutral-700 tracking-[0.3em] uppercase">
            &copy; 2026 PAGEFORGE AI. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </main>
    </>
  );
}
