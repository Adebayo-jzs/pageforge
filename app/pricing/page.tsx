"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function Pricing() {
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

  return (
    <div className="bg-landing-bg text-landing-ink font-dmsans leading-relaxed overflow-x-hidden min-h-screen">
      <Navbar />
      <section className="py-[120px] px-[5%] bg-landing-surface" id="pricing">
        <div className="text-center mb-[60px] reveal">
          <div className="inline-flex items-center justify-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-landing-accent mb-4">
            Pricing
          </div>
          <h2 className="font-instrument text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] tracking-[-0.025em] mb-4">
            Simple pricing,<br /><em className="italic text-landing-accent">zero surprises</em>
          </h2>
          <p className="text-[1.05rem] text-landing-ink-muted max-w-[520px] mx-auto leading-[1.7] font-[350]">Start free. Scale as you grow. Cancel any time.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 max-w-[1100px] mx-auto">
        {PRICING_DATA.map((tier, i) => (
          <div key={i} className={`reveal border-[1.5px] rounded-landing-lg p-9 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-landing-md text-left ${tier.featured ? 'bg-landing-ink border-landing-ink text-white' : 'bg-landing-bg border-landing-border'}`}>
            {tier.featured && <div className="absolute -top-3 left-1/2 -track-x-1/2 -translate-x-1/2 bg-landing-accent text-white rounded-full px-[14px] py-1 text-[0.72rem] font-semibold whitespace-nowrap">Most popular</div>}
            <div className={`text-[0.8rem] font-semibold tracking-[0.06em] uppercase mb-3 ${tier.featured ? 'text-white/60' : 'text-landing-ink-muted'}`}>{tier.name}</div>
            <div className="font-instrument text-[3rem] leading-none tracking-[-0.03em] mb-1">
              <sup className="text-[1.2rem]  mt-2 font-dmsans">$</sup>{tier.price}
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
      <Footer/>
    </div>
  );
}