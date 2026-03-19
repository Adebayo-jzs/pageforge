"use client";
import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, SourceCodeIcon } from "@hugeicons/core-free-icons";

export default function Contribute() {
  return (
    <section className="py-[100px] px-[5%] bg-white border-y border-landing-border relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-landing-accent/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-landing-accent/3 blur-[80px] pointer-events-none rounded-full" />

      <div className="max-w-[1100px] mx-auto text-left relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-landing-accent/10 border border-landing-accent/20 rounded-full px-4 py-1.5 text-[0.75rem] font-bold text-landing-accent mb-8 shadow-landing-sm uppercase tracking-widest animate-fade-up">
              <span className="w-[6px] h-[6px] rounded-full bg-landing-accent animate-pulse" />
              Open Source
            </div>
            
            <h2 className="font-instrument text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-[-0.03em] mb-6 animate-[fade-up_.8s_.15s_ease_both]">
              Help us build the <br />
              <em className="italic text-landing-accent">future of web design</em>
            </h2>
            
            <p className="text-[1.1rem] text-landing-ink-muted max-w-[480px] leading-[1.7] font-[350] mb-10 animate-[fade-up_.8s_.3s_ease_both]">
              PageForge is now open-source. Join a community of developers, designers, and AI enthusiasts building the world's most advanced AI page generator.
            </p>

            <div className="flex flex-wrap gap-4 animate-[fade-up_.8s_.45s_ease_both]">
              <a 
                href="https://github.com/Adebayo-jzs/pageforge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-landing-ink text-white rounded-full px-8 py-4 text-base font-medium transition-all hover:bg-landing-accent hover:-translate-y-1 shadow-landing-md"
              >
                <HugeiconsIcon icon={GithubIcon} className="w-5 h-5" />
                View on GitHub
              </a>
              <a 
                href="https://github.com/Adebayo-jzs/pageforge/blob/main/CONTRIBUTING.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-transparent text-landing-ink border border-landing-border rounded-full px-8 py-4 text-base font-medium transition-all hover:border-landing-accent hover:text-landing-accent hover:-translate-y-1"
              >
                <HugeiconsIcon icon={SourceCodeIcon} className="w-5 h-5" />
                Read Guidelines
              </a>
            </div>
          </div>

          <div className="relative group perspective-[1000px] hidden md:block">
            <div className="bg-landing-bg border border-landing-border rounded-2xl p-6 shadow-landing-xl transition-all duration-500 group-hover:rotate-x-2 group-hover:rotate-y-[-5deg] group-hover:shadow-landing-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-landing-accent/10 flex items-center justify-center text-landing-accent">
                  <HugeiconsIcon icon={GithubIcon} />
                </div>
                <div>
                  <p className="text-sm font-bold text-landing-ink">Adebayo-jzs/pageforge</p>
                  <p className="text-[0.65rem] text-landing-ink-muted">Main Branch </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Pull Requests", value: "Welcome", color: "text-green-500 bg-green-50 border-green-100" },
                  { label: "Status", value: "Open Source", color: "text-landing-accent bg-landing-accent/10 border-landing-accent/20" },
                  { label: "Community", value: "Growing", color: "text-blue-500 bg-blue-50 border-blue-100" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-landing-border last:border-0">
                    <span className="text-xs font-medium text-landing-ink-muted">{item.label}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-white/50 border border-landing-border rounded-xl">
                <p className="text-[0.7rem] leading-relaxed text-landing-ink-muted italic">
                  "PageForge is built on the belief that AI should empower creators, not just replace them. Join us in making web design accessible to everyone."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
