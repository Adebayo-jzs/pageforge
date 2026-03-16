import { useEffect } from "react";
import Link from "next/link";
export default function CTA() {
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
    <section className="bg-landing-bg text-center py-[120px] sm:px-[5%]">
      <div className="reveal max-w-[700px] mx-auto bg-landing-ink rounded-[28px] p-[72px_48px] relative overflow-hidden text-center">
        <div className="absolute rounded-full blur-[60px] pointer-events-none w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(232,82,26,0.25)_0%,transparent_70%)] -top-[100px] -left-[60px]" />
        <div className="absolute rounded-full blur-[60px] pointer-events-none w-[250px] h-[250px] bg-[radial-gradient(circle,rgba(45,91,227,0.2)_0%,transparent_70%)] -bottom-[80px] -right-[40px]" />
        <h2 className="font-instrument text-[clamp(2rem,4vw,3rem)] text-white tracking-[-0.025em] leading-[1.15] mb-4 relative z-[1]">
          Your page won&apos;t build<br />itself. <em className="italic text-landing-accent ">But we will.</em>
        </h2>
        <p className="text-white/50 text-base leading-[1.7] mb-9 font-[350] relative z-[1]">Join 12,000+ builders who launched faster with pageforge. No design skills needed — just a great idea.</p>
        <div className="flex gap-3 justify-center flex-wrap relative z-[1]">
          <Link href="/register" className="bg-landing-accent text-white border-none rounded-full px-8 py-[15px] text-base font-medium cursor-pointer font-inherit shadow-[0_4px_20px_rgba(232,82,26,0.4)] transition-all duration-250 hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(232,82,26,0.55)]">
            Build my page free →
          </Link>
          <button className="bg-white/10 text-white/80 border-[1.5px] border-white/10 rounded-full px-7 py-[14px] text-base font-medium cursor-pointer font-inherit transition-all duration-250 hover:bg-white/[0.14] hover:border-white/[0.22]">
            See examples
          </button>
        </div>
        <p className="mt-4 text-[0.82rem] text-white/30 relative z-[1]">No credit card · Live in 30 seconds · Cancel anytime</p>
      </div>
    </section>
  );
}