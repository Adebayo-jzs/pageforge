"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U";

  const navLinks = [
    { label: "how it works", href: "/how-it-works" },
    { label: "privacy policy", href: "/policy" },
  ];

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string) =>
    `text-xs px-2.5 py-1.5 rounded-md transition-all tracking-wide font-mono ${
      isActive(href)
        ? "text-[#e8ff47]"
        : "text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900"
    }`;

  const mobileLinkClass = (href: string) =>
    `text-xs px-3 py-2.5 rounded-lg transition-all tracking-wide font-mono ${
      isActive(href)
        ? "text-[#e8ff47] bg-[#0d0d00]"
        : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#080808] border-b border-[#141414]">

        {/* Main bar */}
        <div className="flex items-center justify-between h-[52px] px-5 md:px-7">

          {/* Left — logo + desktop links */}
          <div className="flex items-center gap-1">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-1 ml-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                  dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">

            {session ? (
              <>
                {/* New page button — hidden on small screens */}
                <button
                  onClick={() => router.push("/")}
                  className="hidden sm:flex items-center gap-1.5 bg-[#e8ff47] hover:bg-[#d4eb3a]
                             active:scale-95 text-black text-[11px] font-medium font-mono
                             tracking-wider px-3.5 py-[7px] rounded-lg transition-all cursor-pointer"
                >
                  <span className="text-sm leading-none">+</span>
                  new page
                </button>

                {/* Avatar + dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="w-[30px] h-[30px] rounded-full bg-neutral-900 border border-neutral-800
                               hover:border-[#e8ff47] text-[#e8ff47] text-[11px] font-medium font-mono
                               flex items-center justify-center transition-all tracking-wider cursor-pointer"
                    title={session?.user?.email ?? "Account"}
                  >
                    {initials}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-[#0f0f0f]
                                    border border-neutral-800 rounded-xl overflow-hidden shadow-2xl
                                    animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* User info */}
                      <div className="px-3.5 py-3 border-b border-neutral-800">
                        <p className="text-xs text-neutral-300 truncate mb-0.5 font-mono">
                          {session?.user?.name ?? "User"}
                        </p>
                        <p className="text-[11px] text-neutral-600 truncate font-mono">
                          {session?.user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link href="/dashboard" className="dd-item">
                          <span className="text-neutral-600 text-xs">◈</span> dashboard
                        </Link>
                        <Link href="/" className="dd-item">
                          <span className="text-neutral-600 text-xs">+</span> new page
                        </Link>
                        <Link href="/policy" className="dd-item">
                          <span className="text-neutral-600 text-xs">⚖</span> privacy policy
                        </Link>
                      </div>

                      <div className="h-px bg-neutral-800" />

                      <div className="py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="dd-item w-full text-left hover:!bg-red-950/40 hover:!text-red-400"
                        >
                          <span className="text-xs">→</span> sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className={navLinkClass("/login")}>
                  sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-[#e8ff47] hover:bg-[#d4eb3a] text-black text-[11px]
                             font-medium font-mono tracking-wider px-3.5 py-[7px]
                             rounded-lg transition-all"
                >
                  get started
                </Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className={`block h-px w-5 bg-neutral-500 transition-all duration-200 origin-center
                ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-px w-5 bg-neutral-500 transition-all duration-200
                ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-px w-5 bg-neutral-500 transition-all duration-200 origin-center
                ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-800/50 bg-[#080808]
                          px-4 py-3 flex flex-col gap-1
                          animate-in fade-in slide-in-from-top-2 duration-150">

            {/* Nav links */}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={mobileLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}

            {session ? (
              <>
                <Link href="/dashboard" className={mobileLinkClass("/dashboard")}>
                  dashboard
                </Link>

                <div className="h-px bg-neutral-800/50 my-1" />

                <button
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg font-mono
                             text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900
                             transition-all tracking-wide text-left w-full cursor-pointer"
                >
                  <span>+</span> new page
                </button>

                {/* User card */}
                <div className="flex items-center gap-3 px-3 py-2.5 mt-1
                                border border-neutral-800/60 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800
                                  text-[#e8ff47] text-[10px] font-mono flex items-center
                                  justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-300 font-mono truncate">
                      {session?.user?.name ?? "User"}
                    </p>
                    <p className="text-[11px] text-neutral-600 font-mono truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-xs px-3 py-2.5 rounded-lg font-mono text-neutral-600
                             hover:text-red-400 hover:bg-red-950/20 transition-all
                             tracking-wide text-left w-full cursor-pointer"
                >
                  → sign out
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-neutral-800/50 my-1" />
                <Link href="/login" className={mobileLinkClass("/login")}>
                  sign in
                </Link>
                <Link
                  href="/register"
                  className="text-xs px-3 py-2.5 rounded-lg bg-[#e8ff47] text-black
                             font-medium font-mono tracking-wider text-center transition-all"
                >
                  get started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Dropdown item base style — too complex for pure Tailwind inline */}
      <style>{`
        .dd-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          font-size: 12px;
          color: #777;
          transition: all 0.1s;
          background: transparent;
          border: none;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
          text-decoration: none;
          cursor: pointer;
          width: 100%;
        }
        .dd-item:hover {
          background: #161616;
          color: #ccc;
        }
      `}</style>
    </>
  );
}