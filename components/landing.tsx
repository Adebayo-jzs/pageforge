"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import GenerateForm from './generate-form';
import { Ai, Analytics, ComputerPhoneSyncIcon, DragDropIcon, Layout01Icon, Lightning, StarIcon, Variable } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// ─── Sub-components ───────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] h-16 bg-landing-bg/85 backdrop-blur-lg border-b border-landing-border">
      <Link href="#" className="font-instrument text-[1.4rem] tracking-tight text-landing-ink no-underline">
        pageforge<span className="text-landing-accent">.</span>
      </Link>
      <ul className="hidden md:flex gap-8 list-none">
        <li><Link href="#features" className="no-underline text-landing-ink-muted text-[0.9rem] font-[450] hover:text-landing-ink transition-colors duration-200">Features</Link></li>
        <li><Link href="#how" className="no-underline text-landing-ink-muted text-[0.9rem] font-[450] hover:text-landing-ink transition-colors duration-200">How it works</Link></li>
        <li><Link href="#pricing" className="no-underline text-landing-ink-muted text-[0.9rem] font-[450] hover:text-landing-ink transition-colors duration-200">Pricing</Link></li>
      </ul>
      <button className="bg-landing-ink text-white border-none rounded-full px-[22px] py-2 text-[0.875rem] font-medium cursor-pointer transition-all duration-200 hover:bg-landing-accent hover:-translate-y-[1px] font-inherit">
        Start free →
      </button>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-[5%] pt-[120px] pb-20 relative overflow-hidden bg-landing-bg">
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(232,82,26,0.12)_0%,transparent_70%)] -top-[100px] -left-[100px] animate-drift1" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(45,91,227,0.10)_0%,transparent_70%)] bottom-0 -right-20 animate-drift2" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(232,82,26,0.08)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-orb" />

      <div className="inline-flex items-center gap-2 bg-landing-surface border border-landing-border rounded-full px-[14px] py-1.5 text-[0.78rem] font-medium text-landing-ink-muted mb-8 shadow-landing-sm animate-fade-up relative z-[1]">
        <span className="w-[7px] h-[7px] rounded-full bg-landing-accent animate-blink-dot" />
        Powered by GPT-4o · No code required
      </div>

      <h1 className="font-instrument text-[clamp(3rem,8vw,7rem)] leading-none tracking-[-0.03em] max-w-[900px] mb-6 animate-[fade-up_.8s_.15s_ease_both] relative z-[1]">
        Your landing page,<br />
        built in <em className="italic text-landing-accent ">30 seconds</em>
      </h1>

      <p className="text-[clamp(1rem,2vw,1.2rem)] text-landing-ink-muted max-w-[520px] mx-auto leading-[1.7] font-[350] mb-10 animate-[fade-up_.8s_.3s_ease_both] relative z-[1]">
        Describe your product in plain English. pageforge&apos;s AI writes the copy, picks the layout, and ships a stunning page — instantly.
      </p>

      <div className="flex gap-3 flex-wrap justify-center animate-[fade-up_.8s_.45s_ease_both] relative z-[1]">
        {/* <button className="bg-landing-ink text-white border-none rounded-full px-8 py-[15px] text-base font-medium cursor-pointer font-inherit shadow-[0_4px_20px_rgba(26,23,20,0.20)] transition-all duration-250 inline-flex items-center gap-2 hover:bg-landing-accent hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(232,82,26,0.35)]">
          Build my page free →
        </button>
        <button className="bg-transparent text-landing-ink border-[1.5px] border-landing-border rounded-full px-7 py-[14px] text-base font-medium cursor-pointer font-inherit transition-all duration-250 inline-flex items-center gap-2 hover:border-landing-ink hover:-translate-y-[2px]">
          ▶ Watch 60s demo
        </button> */}
        <GenerateForm/>
      </div>

      <div className="mt-[72px] relative animate-[fade-up_.9s_.6s_ease_both] w-full max-w-[900px] z-[1]">
        <div className="bg-landing-surface border border-landing-border rounded-landing-lg overflow-hidden shadow-landing-lg ring-1 ring-white/50 ring-inset">
          <div className="bg-[#EFECE7] p-3 px-4 flex items-center gap-2.5 border-b border-landing-border">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
            </div>
            <div className="flex-1 bg-landing-surface rounded-md py-1 px-3 text-[0.75rem] text-landing-ink-muted border border-landing-border text-left">
              app.pageforge.ai/generate
            </div>
          </div>
          <div className="p-8 bg-[linear-gradient(160deg,#fff_0%,#F9F6F1_100%)] min-h-[280px] grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
            <div className="hidden md:flex flex-col gap-2.5 text-left">
              <div className="bg-landing-bg border border-landing-border rounded-[10px] p-2.5 px-3 text-[0.75rem] text-landing-accent bg-landing-accent-soft border-landing-accent">
                <div className="text-base mb-1">✦</div>
                Hero
              </div>
              <div className="bg-landing-bg border border-landing-border rounded-[10px] p-2.5 px-3 text-[0.75rem] text-landing-ink-muted">
                <div className="text-base mb-1">⊞</div>
                Features
              </div>
              <div className="bg-landing-bg border border-landing-border rounded-[10px] p-2.5 px-3 text-[0.75rem] text-landing-ink-muted">
                <div className="text-base mb-1">◈</div>
                Pricing
              </div>
              <div className="bg-landing-bg border border-landing-border rounded-[10px] p-2.5 px-3 text-[0.75rem] text-landing-ink-muted">
                <div className="text-base mb-1">◎</div>
                CTA
              </div>
            </div>
            <div className="flex flex-col gap-3.5 text-left">
              <div className="bg-[linear-gradient(135deg,#1A1714_0%,#3D3530_100%)] rounded-[10px] p-7 text-white">
                <div className="font-instrument text-2xl leading-[1.2] mb-2">The future of work<br />starts here.</div>
                <div className="text-[0.72rem] opacity-60 mb-3.5">AI-powered productivity tools for teams.</div>
                <div className="inline-block bg-landing-accent text-white rounded-full px-3.5 py-1.5 text-[0.72rem] font-medium">Get started free</div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-landing-bg rounded-lg p-2.5 border border-landing-border">
                  <div className="text-[0.72rem] font-semibold text-landing-ink mb-[3px]">⚡ Instant generation</div>
                  <div className="text-[0.65rem] text-landing-ink-muted">Page ready in under 30s</div>
                </div>
                <div className="bg-landing-bg rounded-lg p-2.5 border border-landing-border">
                  <div className="text-[0.72rem] font-semibold text-landing-ink mb-[3px]">🎨 Smart design</div>
                  <div className="text-[0.65rem] text-landing-ink-muted">Adapts to your brand</div>
                </div>
              </div>
              <div className="h-[3px] bg-landing-border rounded-[2px] overflow-hidden mt-2">
                <div className="h-full bg-[linear-gradient(90deg,var(--color-landing-accent),var(--color-landing-accent-2))] w-[72%] rounded-[2px] animate-grow-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES_DATA = [
  { icon: Ai, title: 'AI Copywriting', text: 'Compelling headlines, benefit-driven body copy, and persuasive CTAs — all generated from a single sentence.' },
  { icon:Layout01Icon, title: 'Layout Intelligence', text: 'The AI picks the optimal section order and visual hierarchy based on your goal — capture, convert, or inform.' },
  { icon: DragDropIcon, title: 'Brand Matching', text: 'Paste your logo URL or describe your brand. pageforge extracts colors, tone, and style automatically.' },
  { icon: Lightning, title: 'One-click Publishing', text: 'Deploy to a custom subdomain in milliseconds. Connect your own domain with two DNS records.' },
  { icon: Variable, title: 'A/B Variants', text: 'Generate 3 headline variants and let real traffic decide the winner. No guesswork, no dev time.' },
  { icon: Analytics, title: 'Analytics Built-in', text: 'Conversion rate, scroll depth, and click heatmaps ship with every page. No third-party tags needed.' },
  { icon: ComputerPhoneSyncIcon, title: 'Responsive by default', text: 'Pixel-perfect layouts that look stunning on mobile, tablet, and desktop.' },
];

function Features() {
  return (
    <section className="py-[100px] px-[5%] bg-landing-surface" id="features">
      <div className="mb-[60px] reveal text-left">
        <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-landing-accent mb-4 before:content-[''] before:block before:w-5 before:h-[2px] before:bg-landing-accent before:rounded-[1px]">
          Features
        </div>
        <h2 className="font-instrument text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.025em] mb-4">
          Everything the AI handles<br />so you <em className="italic text-landing-accent ">don&apos;t have to</em>
        </h2>
        <p className="text-[1.05rem] text-landing-ink-muted max-w-[520px] leading-[1.7] font-[350]">From first prompt to live URL — the entire creative and technical stack, automated.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {FEATURES_DATA.map((feat, i) => (
          <div key={i} className="reveal bg-landing-bg border border-landing-border rounded-landing-lg p-8 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 hover:shadow-landing-md hover:border-landing-accent/20 text-left">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-landing-accent-soft)_0%,transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="w-11 h-11 bg-landing-surface border border-landing-border rounded-xl flex items-center justify-center text-lg mb-5 relative z-[1]">
             <HugeiconsIcon icon={feat.icon}/> 
            </div>
            <div className="font-semibold text-[1.05rem] mb-2 relative z-[1]">{feat.title}</div>
            <p className="text-landing-ink-muted text-[0.9rem] leading-[1.6] font-[350] relative z-[1]">{feat.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-[100px] hidden px-[5%] bg-landing-bg" id="how">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-landing-accent mb-4 before:content-[''] before:block before:w-5 before:h-[2px] before:bg-landing-accent before:rounded-[1px] reveal">
            How it works
          </div>
          <h2 className="font-instrument text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.025em] mb-4 reveal">
            Live in <em className="italic text-landing-accent ">three steps.</em><br />Seriously.
          </h2>
          <div className="flex flex-col gap-0">
            {[
              { num: '01', title: 'Describe your product', text: "Type a sentence or two about what you&apos;re building, who it&apos;s for, and what action you want visitors to take." },
              { num: '02', title: 'Review & refine with AI', text: 'The AI generates a full page draft. Chat with it to tweak sections, swap layouts, or rewrite copy in seconds.' },
              { num: '03', title: 'Publish and grow', text: 'Hit publish. Your page is live, indexed, and collecting leads — with analytics tracking from day one.' },
            ].map((step, i) => (
              <div key={i} className="reveal flex gap-5 py-7 border-b border-landing-border last:border-b-0 relative cursor-pointer group transition-all duration-200">
                <div className="w-9 h-9 min-w-9 rounded-full bg-landing-surface border-[1.5px] border-landing-border flex items-center justify-center text-[0.78rem] font-semibold text-landing-ink-muted mt-0.5 transition-all duration-200 group-hover:bg-landing-accent group-hover:border-landing-accent group-hover:text-white">
                  {step.num}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-base mb-1 transition-colors duration-200 group-hover:text-landing-accent">{step.title}</h3>
                  <p className="text-[0.88rem] text-landing-ink-muted leading-[1.6] font-[350]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-landing-surface border border-landing-border rounded-landing-lg overflow-hidden shadow-landing-lg reveal text-left">
          <div className="p-4 px-5 bg-landing-bg border-b border-landing-border text-[0.8rem] font-semibold text-landing-ink-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#28CA41]" />
            pageforge AI · Generating your page…
          </div>
          <div className="p-6 flex flex-col gap-3.5">
            <div className="max-w-[85%] p-3 px-4 rounded-2xl rounded-tr-sm self-end bg-landing-ink text-white text-[0.85rem] leading-[1.5]">
              A SaaS tool that helps freelancers track time and send invoices. Target: designers & developers. Goal: free trial signups.
            </div>
            <div className="max-w-[85%] p-3 px-4 rounded-2xl rounded-tl-sm self-start bg-landing-bg border border-landing-border text-[0.85rem] leading-[1.5]">
              <div className="text-[0.7rem] font-semibold text-landing-accent mb-1">pageforge AI</div>
              Got it! Crafting a high-converting landing page for your time-tracking & invoicing tool. Focusing on pain points: chasing payments, manual logging, scope creep.
              <div className="flex gap-1 items-center py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-landing-ink-faint animate-bounce-gen" />
                <div className="w-1.5 h-1.5 rounded-full bg-landing-ink-faint animate-bounce-gen [animation-delay:.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-landing-ink-faint animate-bounce-gen [animation-delay:.4s]" />
              </div>
            </div>
            <div className="max-w-[85%] p-3 px-4 rounded-2xl rounded-tl-sm self-start bg-landing-bg border border-landing-border text-[0.85rem] leading-[1.5]">
              <div className="text-[0.7rem] font-semibold text-landing-accent mb-1">pageforge AI</div>
              ✅ Hero: &quot;Stop chasing invoices. Start chasing ideas.&quot;<br />✅ 5 feature cards generated<br />✅ Pricing section — 3 tiers<br />✅ Social proof — 3 testimonials<br />
              <strong>Your page is ready to preview →</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS_DATA = [
  { quote: '"I went from idea to a live landing page in 22 minutes. My previous record was a week. I&apos;m never going back."', author: 'Amir Khalil', role: 'Indie founder · ProductHunt #1', initials: 'AK', gradient: 'from-[#E8521A] to-[#c73e08]' },
  { quote: '"The copy it writes is genuinely better than what our content team produces. It understands positioning on a deep level."', author: 'Sara Müller', role: 'Head of Growth · Fintech startup', initials: 'SM', gradient: 'from-[#2D5BE3] to-[#1a3db3]' },
  { quote: '"We ran an A/B test — pageforge&apos;s AI variant beat our hand-crafted page by 34% conversion. The data speaks for itself."', author: 'James Ruiz', role: 'Marketing Lead · B2B SaaS', initials: 'JR', gradient: 'from-[#1A1714] to-[#4a3f3a]' },
];

function Testimonials() {
  return (
    <section className="py-[100px] px-[5%] bg-landing-ink text-white">
      <div className="reveal text-left">
        <div className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-landing-accent mb-4 before:content-[''] before:block before:w-5 before:h-[2px] before:bg-landing-accent before:rounded-[1px]">
          Testimonials
        </div>
        <h2 className="font-instrument text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.025em] mb-4 text-white">
          Loved by <em className="italic text-landing-accent ">builders</em><br />who ship fast
        </h2>
        <p className="text-[1.05rem] text-white/50 max-w-[520px] leading-[1.7] font-[350]">Thousands of founders, makers, and marketers have launched with pageforge.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 mt-[60px]">
        {TESTIMONIALS_DATA.map((testi, i) => (
          <div key={i} className="reveal bg-white/5 border border-white/10 rounded-landing-lg p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:border-landing-accent/30 text-left">
            <div className="flex gap-1 text-landing-accent text-[0.85rem] mb-4">
              {[...Array(5)].map((_, i) => (
                <HugeiconsIcon key={i} icon={StarIcon} />
              ))}
            </div>
            <div className="font-instrument text-[1.05rem] leading-[1.7] text-white/80 mb-6 italic">{testi.quote}</div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[0.9rem] text-white bg-gradient-to-br ${testi.gradient}`}>
                {testi.initials}
              </div>
              <div className="text-left">
                <div className="font-semibold text-[0.9rem] text-white text-left">{testi.author}</div>
                <div className="text-[0.78rem] text-white/40 text-left">{testi.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const PRICING_DATA = [
  {
    name: 'Starter', price: '0', period: 'forever free',
    desc: 'Perfect for testing your idea and getting your first page live.',
    btn: 'Get started', btnClass: 'bg-transparent text-landing-ink border-[1.5px] border-landing-border hover:bg-landing-ink hover:text-white',
    features: [
      { check: true, text: '3 pages' }, { check: true, text: 'AI copywriting' },
      { check: true, text: 'pageforge.ai subdomain' }, { check: true, text: 'Basic analytics' },
      { check: false, text: 'Custom domain' }, { check: false, text: 'A/B testing' },
    ]
  },
  {
    name: 'Pro', price: '29', period: 'per month', featured: true,
    desc: 'For founders and marketers who need to move fast without trade-offs.',
    btn: 'Start free trial', btnClass: 'bg-landing-accent text-white border-none shadow-[0_4px_16px_rgba(232,82,26,0.35)] hover:shadow-[0_8px_24px_rgba(232,82,26,0.45)] hover:-translate-y-[2px]',
    features: [
      { check: true, text: 'Unlimited pages' }, { check: true, text: 'AI copywriting + variants' },
      { check: true, text: 'Custom domain' }, { check: true, text: 'Advanced analytics' },
      { check: true, text: 'A/B testing' }, { check: true, text: 'Priority support' },
    ]
  },
  {
    name: 'Team', price: '79', period: 'per month',
    desc: 'Collaborate, manage clients, and white-label with your own branding.',
    btn: 'Contact sales', btnClass: 'bg-transparent text-landing-ink border-[1.5px] border-landing-border hover:bg-landing-ink hover:text-white',
    features: [
      { check: true, text: 'Everything in Pro' }, { check: true, text: '5 team seats' },
      { check: true, text: 'White-label' }, { check: true, text: 'Client workspaces' },
      { check: true, text: 'API access' }, { check: true, text: 'Dedicated CSM' },
    ]
  }
];

function Pricing() {
  return (
    <section className="py-[100px] px-[5%] bg-landing-surface" id="pricing">
      <div className="text-center mb-[60px] reveal">
        <div className="inline-flex items-center justify-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-landing-accent mb-4">
          Pricing
        </div>
        <h2 className="font-instrument text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.025em] mb-4">
          Simple pricing,<br /><em className="italic text-landing-accent ">zero surprises</em>
        </h2>
        <p className="text-[1.05rem] text-landing-ink-muted max-w-[520px] mx-auto leading-[1.7] font-[350]">Start free. Scale as you grow. Cancel any time.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 max-w-[960px] mx-auto">
        {PRICING_DATA.map((tier, i) => (
          <div key={i} className={`reveal border-[1.5px] rounded-landing-lg p-9 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-landing-md text-left ${tier.featured ? 'bg-landing-ink border-landing-ink text-white' : 'bg-landing-bg border-landing-border'}`}>
            {tier.featured && <div className="absolute -top-3 left-1/2 -track-x-1/2 -translate-x-1/2 bg-landing-accent text-white rounded-full px-[14px] py-1 text-[0.72rem] font-semibold whitespace-nowrap">Most popular</div>}
            <div className={`text-[0.8rem] font-semibold tracking-[0.06em] uppercase mb-3 ${tier.featured ? 'text-white/60' : 'text-landing-ink-muted'}`}>{tier.name}</div>
            <div className="font-instrument text-[3rem] leading-none tracking-[-0.03em] mb-1">
              <sup className="text-[1.2rem] align-top mt-2 font-dmsans">$</sup>{tier.price}
            </div>
            <div className={`text-[0.85rem] mb-3 ${tier.featured ? 'text-white/40' : 'text-landing-ink-muted'}`}>{tier.period}</div>
            <div className={`text-[0.88rem] mb-7 leading-[1.5] ${tier.featured ? 'text-white/50' : 'text-landing-ink-muted'}`}>{tier.desc}</div>
            <button className={`w-full py-[13px] rounded-full text-[0.9rem] font-medium cursor-pointer font-inherit transition-all duration-250 mb-7 ${tier.btnClass}`}>
              {tier.btn}
            </button>
            <div className="flex flex-col gap-0">
              {tier.features.map((feat, j) => (
                <div key={j} className={`flex items-center gap-2.5 text-[0.88rem] py-[9px] border-b last:border-b-0 ${tier.featured ? 'border-white/10' : 'border-landing-border'} ${feat.check ? '' : 'opacity-40'}`}>
                  <span className="text-landing-accent text-[0.85rem]">{feat.check ? '✓' : '—'}</span> {feat.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-landing-bg text-center py-[120px] px-[5%]">
      <div className="reveal max-w-[700px] mx-auto bg-landing-ink rounded-[28px] p-[72px_48px] relative overflow-hidden text-center">
        <div className="absolute rounded-full blur-[60px] pointer-events-none w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(232,82,26,0.25)_0%,transparent_70%)] -top-[100px] -left-[60px]" />
        <div className="absolute rounded-full blur-[60px] pointer-events-none w-[250px] h-[250px] bg-[radial-gradient(circle,rgba(45,91,227,0.2)_0%,transparent_70%)] -bottom-[80px] -right-[40px]" />
        <h2 className="font-instrument text-[clamp(2rem,4vw,3rem)] text-white tracking-[-0.025em] leading-[1.15] mb-4 relative z-[1]">
          Your page won&apos;t build<br />itself. <em className="italic text-landing-accent ">But we will.</em>
        </h2>
        <p className="text-white/50 text-base leading-[1.7] mb-9 font-[350] relative z-[1]">Join 12,000+ builders who launched faster with pageforge. No design skills needed — just a great idea.</p>
        <div className="flex gap-3 justify-center flex-wrap relative z-[1]">
          <button className="bg-landing-accent text-white border-none rounded-full px-8 py-[15px] text-base font-medium cursor-pointer font-inherit shadow-[0_4px_20px_rgba(232,82,26,0.4)] transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(232,82,26,0.55)]">
            Build my page free →
          </button>
          <button className="bg-white/10 text-white/80 border-[1.5px] border-white/10 rounded-full px-7 py-[14px] text-base font-medium cursor-pointer font-inherit transition-all duration-250 hover:bg-white/[0.14] hover:border-white/[0.22]">
            See examples
          </button>
        </div>
        <p className="mt-4 text-[0.82rem] text-white/30 relative z-[1]">No credit card · Live in 30 seconds · Cancel anytime</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-landing-ink p-8 px-[5%] flex items-center justify-between flex-wrap gap-3 border-t border-white/10">
      <Link href="#" className="font-instrument text-white/60 text-[1.1rem] no-underline">
        pageforge<span className="text-landing-accent">.</span>
      </Link>
      <p className="text-[0.8rem] text-white/20">© 2026 pageforge Inc. All rights reserved.</p>
    </footer>
  );
}

export default function Landing() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const parent = target.parentElement;
          if (!parent) return;

          // Stagger siblings in the same parent
          const siblings = Array.from(parent.querySelectorAll('.reveal')) as HTMLElement[];
          const unrevealedSiblings = siblings.filter(sib => !sib.classList.contains('visible'));
          
          let delay = 0;
          unrevealedSiblings.forEach(sib => {
            if (sib === target) {
              setTimeout(() => sib.classList.add('visible'), delay);
            }
            delay += 60;
          });

          target.classList.add('visible');
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const currentReveals = document.querySelectorAll('.reveal');
    currentReveals.forEach(el => observer.observe(el));

    return () => {
      currentReveals.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-landing-bg text-landing-ink font-dmsans leading-relaxed overflow-x-hidden min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}