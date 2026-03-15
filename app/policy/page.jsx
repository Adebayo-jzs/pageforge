"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Logo from "@/components/logo";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#ededed]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-20 pb-40">
        {/* Header Section */}
        <section className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bebas tracking-tight text-white mb-6 leading-none">
            Legal & <span className="text-[#e8ff47]">Policy</span>
          </h1>
          <p className="font-mono text-sm text-[#444] tracking-widest uppercase">
            Last Updated: March 15, 2026
          </p>
        </section>

        {/* Introduction */}
        <div className="space-y-32">
          <section className="animate-in fade-in duration-1000 delay-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-neutral-800" />
              <h2 className="text-3xl font-bebas text-white tracking-wide">Overview</h2>
              <div className="h-px w-12 bg-[#e8ff47]" />
            </div>
            <p className="font-mono text-neutral-400 leading-relaxed mb-6">
              Welcome to PageForge. We are committed to protecting your privacy and ensuring a transparent relationship with our users. This document outlines how we collect, use, and safeguard your data, as well as the terms governing your use of our AI-powered landing page generation services.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="animate-in fade-in duration-1000 delay-200">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-neutral-800" />
              <h2 className="text-3xl font-bebas text-white tracking-wide">Privacy Policy</h2>
              <div className="h-px w-12 bg-[#e8ff47]" />
            </div>
            
            <div className="grid gap-12">
              <div className="group border-l border-neutral-800 pl-8 hover:border-[#e8ff47] transition-colors">
                <h3 className="text-[#e8ff47] font-bebas text-xl mb-4 tracking-wider uppercase">Data Collection</h3>
                <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                  We collect information necessary to provide our services, including your email address through OAuth providers (GitHub/Google) and the prompts you provide for landing page generation. We do not sell your personal data.
                </p>
              </div>

              <div className="group border-l border-neutral-800 pl-8 hover:border-[#e8ff47] transition-colors">
                <h3 className="text-[#e8ff47] font-bebas text-xl mb-4 tracking-wider uppercase">AI Processing</h3>
                <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                  Your prompts are processed by third-party AI providers (Google Gemini, OpenAI). These providers may have their own data retention policies regarding the inputs provided to their models.
                </p>
              </div>

              <div className="group border-l border-neutral-800 pl-8 hover:border-[#e8ff47] transition-colors">
                <h3 className="text-[#e8ff47] font-bebas text-xl mb-4 tracking-wider uppercase">Security</h3>
                <p className="font-mono text-sm text-neutral-400 leading-relaxed">
                  We use industry-standard encryption to protect your data during transmission and at rest. Your authenticated sessions are managed securely via NextAuth.js.
                </p>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="animate-in fade-in duration-1000 delay-300">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-neutral-800" />
              <h2 className="text-3xl font-bebas text-white tracking-wide">Terms of Service</h2>
              <div className="h-px w-12 bg-[#e8ff47]" />
            </div>

            <div className="space-y-20">
              <div className="bg-[#0f0f0f] border border-neutral-900 p-8 rounded-2xl">
                <h3 className="text-white font-bebas text-2xl mb-6">User Responsibilities</h3>
                <ul className="space-y-4 font-mono text-sm text-neutral-400">
                  <li className="flex gap-4">
                    <span className="text-[#e8ff47] flex-shrink-0">01</span>
                    <span>You are responsible for the content of the prompts you submit.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#e8ff47] flex-shrink-0">02</span>
                    <span>Generated pages must not be used for illegal, harmful, or deceptive purposes.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-[#e8ff47] flex-shrink-0">03</span>
                    <span>You must respect the rate limits and fair use policies of our platform.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0f0f0f] border border-neutral-900 p-8 rounded-2xl">
                <h3 className="text-white font-bebas text-2xl mb-6">Intellectual Property</h3>
                <p className="font-mono text-sm text-neutral-400 leading-relaxed mb-6">
                  PageForge grants you a non-exclusive, perpetual license to use, host, and modify the code locally generated by our service. The PageForge logo, brand, and platform architecture remains the property of PageForge.
                </p>
                <div className="inline-block bg-[#e8ff47]/10 border border-[#e8ff47]/20 px-4 py-2 rounded-lg">
                  <span className="text-[#e8ff47] text-[10px] font-bold tracking-widest uppercase">Note: Yours to keep and deploy anywhere.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="animate-in fade-in duration-1000 delay-400 text-center">
            <div className="inline-block w-16 h-px bg-neutral-800 mb-10" />
            <h2 className="text-3xl font-bebas text-white mb-6">Questions?</h2>
            <p className="font-mono text-sm text-neutral-500 mb-8 max-w-lg mx-auto">
              If you have any questions about these policies or our data practices, please contact us at:
            </p>
            <a 
              href="mailto:legal@pageforge.ai" 
              className="text-2xl font-bebas text-[#e8ff47] hover:text-white transition-colors tracking-widest"
            >
              legal@pageforge.ai
            </a>
          </section>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="h-20 border-t border-neutral-900 flex items-center justify-center">
        <p className="text-[10px] text-neutral-600 tracking-[0.2em] font-mono uppercase">
          &copy; 2026 PageForge AI. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
