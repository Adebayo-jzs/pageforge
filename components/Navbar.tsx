"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GenerateForm from "./generate-form";
// import Logo from "./logo";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon,ArrowRight02Icon,Cancel01Icon, CourtLawIcon, LayoutDashboard } from "@hugeicons/core-free-icons";
import TextIcon from "./texticon";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U";

  const navLinks = [
    { label: "how it works", href: "/how-it-works" },
    { label: "privacy policy", href: "/policy" },
    { label: "pricing", href: "/pricing" },
  ];

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string) =>
    `text-xs px-2.5 py-1.5 rounded-md transition-all tracking-wide font-dmsans font-medium ${
      isActive(href)
        ? "text-landing-accent"
        : "text-landing-ink-muted hover:text-landing-ink hover:bg-landing-ink/5"
    }`;

  const mobileLinkClass = (href: string) =>
    `text-xs px-3 py-2.5 rounded-lg transition-all tracking-wide font-dmsans font-medium ${
      isActive(href)
        ? "text-landing-accent bg-landing-accent/5"
        : "text-landing-ink-muted hover:text-landing-ink hover:bg-landing-ink/5"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] h-16 bg-landing-bg/85 backdrop-blur-lg border-b border-landing-border">
      <Link href="/" className="font-instrument text-[1.4rem] tracking-tight text-landing-ink no-underline">
        pageforge<span className="text-landing-accent">.</span>
      </Link>
       
      <div className="hidden md:flex items-center gap-1 ml-2">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-2">
      {session ? (
        <div ref={dropdownRef} className="relative">
          <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="w-[30px] h-[30px] rounded-full bg-landing-surface border border-landing-border
                      hover:border-landing-accent text-landing-accent text-[11px] font-medium font-dmsans
                      flex items-center justify-center transition-all tracking-wider cursor-pointer shadow-landing-sm"
          title={session?.user?.email ?? "Account"}
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
          ) : (
            session?.user?.name?.[0] || "U"
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-white
                          border border-landing-border rounded-xl overflow-hidden shadow-landing-lg
                          animate-in fade-in slide-in-from-top-1 duration-150 z-50">
            {/* User info */}
            <div className="px-3.5 py-3 border-b border-landing-border bg-landing-bg">
              <p className="text-xs text-landing-ink truncate mb-0.5 font-bold">
                {session?.user?.name ?? "User"}
              </p>
              <p className="text-[10px] text-landing-ink-faint truncate font-medium">
                {session?.user?.email}
              </p>
            </div>
        
            <div className="py-1 px-3.5">
              <Link href="/dashboard" className="dd-item flex items-center justify-start gap-2">
                <HugeiconsIcon icon={LayoutDashboard} className="w-5 h-5" /> dashboard
              </Link>
              <button onClick={() => setIsModalOpen(true)} className="dd-item flex items-center justify-start gap-2">
                <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" /> new page
              </button>
              <Link href="/policy" className="dd-item flex items-center justify-start gap-2">
                <HugeiconsIcon icon={CourtLawIcon} className="w-5 h-5" /> privacy policy
              </Link>
            </div>
        
            <div className="h-px  bg-landing-border" />
        
              <div className="py-1 px-3.5">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="dd-item w-full flex tems-center gap-2 text-left hover:!bg-red-50 hover:!text-red-500"
                >
                  <HugeiconsIcon icon={ArrowRight02Icon} className="h-5 w-5"/> sign out
                </button>
              </div>
            </div>
          )}
        </div>
      ):(
        <>
        <Link href="/register" className="bg-landing-ink text-white border-none rounded-full px-[22px] py-2 text-[0.875rem] font-medium cursor-pointer transition-all duration-200 hover:bg-landing-accent hover:-translate-y-[1px] font-inherit">
        Start free →
        </Link>
        </>

      )}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer relative z-[160]"
        aria-label="Toggle menu"
      >
        <span className={`block h-px w-5 bg-landing-ink transition-all duration-300 origin-center
          ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
        <span className={`block h-px w-5 bg-landing-ink transition-all duration-300
          ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
        <span className={`block h-px w-5 bg-landing-ink transition-all duration-300 origin-center
          ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
      </button>
      </div>
    </nav>
      {mobileOpen && (
          <div className="fixed inset-0 z-[150] bg-landing-bg flex flex-col items-center justify-center gap-8 p-10 animate-in fade-in zoom-in-95 duration-300 overflow-y-auto">
            
            {/* Logo in overlay */}
            <div className="absolute top-5 left-[5%]">
              <TextIcon/>
            </div>

            {/* Close button in overlay */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-[5%] w-10 h-10 flex items-center justify-center text-landing-ink hover:text-landing-accent transition-colors cursor-pointer text-3xl font-light"
            >
              <HugeiconsIcon icon={Cancel01Icon}/>
            </button>

            {/* Nav links */}
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`text-2xl font-instrument tracking-tight transition-all ${
                    isActive(link.href) ? "text-landing-accent" : "text-landing-ink hover:text-landing-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link 
                  href="/dashboard" 
                  className={`text-2xl font-instrument tracking-tight transition-all ${
                    isActive("/dashboard") ? "text-landing-accent" : "text-landing-ink hover:text-landing-accent"
                  }`}
                >
                  dashboard
                </Link>
              )}
            </div>

            <div className="w-full max-w-[200px] h-px bg-landing-border" />

            {session ? (
              <div className="flex flex-col items-center gap-6 w-full">
                {/* User Info */}
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-landing-surface border border-landing-border flex items-center justify-center text-landing-accent text-xl font-medium shadow-landing-md overflow-hidden">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-instrument text-landing-ink">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-landing-ink-muted">{session?.user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                  <button
                    onClick={() => {
                        setMobileOpen(false);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-landing-accent text-white py-3 rounded-xl font-medium shadow-landing-sm hover:shadow-landing-md transition-all active:scale-95"
                  >
                    <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
                    New Page
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="py-3 text-landing-ink-muted hover:text-red-500 font-medium transition-colors"
                  >
                    Sign Out →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-[240px]">
                <Link 
                  href="/login" 
                  className="flex items-center justify-center py-3 text-landing-ink font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="flex items-center justify-center bg-landing-ink text-white py-4 rounded-xl font-medium shadow-landing-lg hover:bg-landing-accent transition-all animate-bounce-subtle"
                >
                  Start free →
                </Link>
              </div>
            )}
          </div>
        )}
      

        {isModalOpen && (
          <div 
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <div className="w-full max-w-2xl bg-landing-bg border border-landing-border rounded-2xl p-8 relative shadow-landing-lg animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-landing-ink-muted hover:text-landing-ink transition-colors cursor-pointer text-2xl"
              >
                ×
              </button>
              <div className="mb-8">
                <h2 className="text-2xl font-instrument mb-2 text-landing-ink tracking-tight">Create New Project</h2>
                <p className="text-sm text-landing-ink-muted">Describe what you want to build and PageForge will generate it for you.</p>
              </div>
              <GenerateForm />
            </div>
          </div>
        )}
       
    </>
  );
}