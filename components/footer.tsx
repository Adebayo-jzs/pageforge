import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-landing-ink p-8 px-[5%] flex items-center justify-between flex-wrap gap-3 border-t border-white/10">
      <Link href="#" className="font-instrument text-white/60 text-[1.1rem] no-underline">
        pageforge<span className="text-landing-accent">.</span>
      </Link>
      <p className="text-[0.8rem] text-white/20">© 2026 pageforge Inc. All rights reserved.</p>
    </footer>
  );
}