"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer"
import TextIcon from "@/components/texticon";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-ink font-dmsans">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-24 pb-40">
        {/* Header Section */}
        <section className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex justify-center mb-8">
            <TextIcon/>
          </div>
          <h1 className="text-6xl md:text-8xl font-instrument tracking-tight text-landing-ink mb-6 leading-none">
            Legal & <span className="text-landing-accent italic">Policy</span>
          </h1>
          <p className="text-xs text-landing-ink-faint tracking-widest uppercase font-bold">
            Last Updated: March 15, 2026
          </p>
        </section>

        {/* Introduction */}
        <div className="space-y-32">
          <section className="reveal visible">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-landing-border" />
              <h2 className="text-3xl font-instrument text-landing-ink tracking-tight">Overview</h2>
              <div className="h-px w-12 bg-landing-accent" />
            </div>
            <p className="text-lg text-landing-ink-muted leading-relaxed mb-6 font-[350]">
              Welcome to PageForge. We are committed to protecting your privacy and ensuring a transparent relationship with our users. This document outlines how we collect, use, and safeguard your data, as well as the terms governing your use of our AI-powered landing page generation services.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="reveal visible">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-landing-border" />
              <h2 className="text-3xl font-instrument text-landing-ink tracking-tight">Privacy Policy</h2>
              <div className="h-px w-12 bg-landing-accent" />
            </div>
            
            <div className="grid gap-12">
              <div className="group border-l border-landing-border pl-8 hover:border-landing-accent transition-colors">
                <h3 className="text-landing-accent font-bold text-lg mb-4 tracking-wider uppercase">Data Collection</h3>
                <p className="text-sm text-landing-ink-muted leading-relaxed font-[350]">
                  We collect information necessary to provide our services, including your email address through OAuth providers (GitHub/Google) and the prompts you provide for landing page generation. We do not sell your personal data.
                </p>
              </div>

              <div className="group border-l border-landing-border pl-8 hover:border-landing-accent transition-colors">
                <h3 className="text-landing-accent font-bold text-lg mb-4 tracking-wider uppercase">AI Processing</h3>
                <p className="text-sm text-landing-ink-muted leading-relaxed font-[350]">
                  Your prompts are processed by third-party AI providers (Google Gemini, OpenAI). These providers may have their own data retention policies regarding the inputs provided to their models.
                </p>
              </div>

              <div className="group border-l border-landing-border pl-8 hover:border-landing-accent transition-colors">
                <h3 className="text-landing-accent font-bold text-lg mb-4 tracking-wider uppercase">Security</h3>
                <p className="text-sm text-landing-ink-muted leading-relaxed font-[350]">
                  We use industry-standard encryption to protect your data during transmission and at rest. Your authenticated sessions are managed securely via NextAuth.js.
                </p>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="reveal visible">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-landing-border" />
              <h2 className="text-3xl font-instrument text-landing-ink tracking-tight">Terms of Service</h2>
              <div className="h-px w-12 bg-landing-accent" />
            </div>

            <div className="space-y-20">
              <div className="bg-white border border-landing-border p-8 rounded-2xl shadow-landing-sm">
                <h3 className="text-landing-ink font-instrument text-2xl mb-6">User Responsibilities</h3>
                <ul className="space-y-4 text-sm text-landing-ink-muted font-[350]">
                  <li className="flex gap-4">
                    <span className="text-landing-accent font-bold flex-shrink-0">01</span>
                    <span>You are responsible for the content of the prompts you submit.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-landing-accent font-bold flex-shrink-0">02</span>
                    <span>Generated pages must not be used for illegal, harmful, or deceptive purposes.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-landing-accent font-bold flex-shrink-0">03</span>
                    <span>You must respect the rate limits and fair use policies of our platform.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-landing-border p-8 rounded-2xl shadow-landing-sm">
                <h3 className="text-landing-ink font-instrument text-2xl mb-6">Intellectual Property</h3>
                <p className="text-sm text-landing-ink-muted leading-relaxed mb-6 font-[350]">
                  PageForge grants you a non-exclusive, perpetual license to use, host, and modify the code locally generated by our service. The PageForge logo, brand, and platform architecture remains the property of PageForge.
                </p>
                <div className="inline-block bg-landing-accent/10 border border-landing-accent/20 px-4 py-2 rounded-lg">
                  <span className="text-landing-accent text-[10px] font-bold tracking-widest uppercase">Note: Yours to keep and deploy anywhere.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="reveal visible text-center">
            <div className="inline-block w-16 h-px bg-landing-border mb-10" />
            <h2 className="text-3xl font-instrument text-landing-ink mb-6">Questions?</h2>
            <p className="text-sm text-landing-ink-muted mb-8 max-w-lg mx-auto font-[350]">
              If you have any questions about these policies or our data practices, please contact us at:
            </p>
            <a 
              href="mailto:legal@pageforge.ai" 
              className="text-4xl font-instrument text-landing-accent hover:text-landing-accent/80 transition-colors tracking-tight italic"
            >
              legal@pageforge.ai
            </a>
          </section>
        </div>
      </main>

      {/* Footer Decoration */}
      <Footer/>
    </div>
  );
}
