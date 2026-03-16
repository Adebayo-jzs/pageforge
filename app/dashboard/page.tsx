"use client";
import { useState, useEffect,useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import GenerateForm from "@/components/generate-form";
import TextIcon from "@/components/texticon";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Add01Icon, 
  Home01Icon, 
  Search01Icon, 
  Book02Icon, 
  Folder01Icon, 
  StarIcon, 
  UserIcon, 
  Share01Icon,
  CrownIcon,
  GiftIcon,
  Menu01Icon,
  SidebarLeft01Icon,
  ArrowRight01Icon,
  RecordIcon,
  ImageAdd01Icon,
  ArrowUp01Icon
} from "@hugeicons/core-free-icons";
import Link from "next/link";

type Page = {
  _id: string;
  prompt: string;
  provider: string;
  createdAt: string;
  html?: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Recently viewed");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if on mobile to set initial state
    const checkMobile = () => {
      if (window.innerWidth < 1024) { // Collapse on tablets/mobile
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setPages(Array.isArray(data) ? data : (data.pages ?? []));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentPages = pages.slice(0, 4);

  return (
    <div className="flex h-screen bg-landing-bg text-landing-ink font-dmsans overflow-hidden">
      
      {/* ─── Sidebar Overlay (Mobile) ─── */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* ─── Sidebar ─── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 lg:relative ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-0"} transition-all duration-300 border-r border-landing-border bg-white flex flex-col shrink-0 overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-landing-accent flex items-center justify-center text-white font-bold shadow-landing-sm">
                P
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold leading-none">{session?.user?.name || "User"}&apos;s Space</span>
                <span className="text-[10px] text-landing-ink-faint font-medium">Personal</span>
            </div>
          </div>
          <button className="text-landing-ink-faint hover:text-landing-ink cursor-pointer">
            <HugeiconsIcon icon={SidebarLeft01Icon} className="w-4 h-4" onClick={() => setIsSidebarOpen(false)} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <nav className="space-y-1">
            <SidebarItem icon={Home01Icon} link="/" label="Home" active />
            {/* <SidebarItem icon={Search01Icon} link="" label="Search" badge="Ctrl K" /> */}
            {/* <SidebarItem icon={Book02Icon} label="Resources" /> */}
          </nav>

          <div>
            <h3 className="px-3 text-[10px] font-bold text-landing-ink-faint uppercase tracking-widest mb-2">Projects</h3>
            <nav className="space-y-1">
              <SidebarItem icon={Folder01Icon} label="All projects" />
              <SidebarItem icon={StarIcon} label="Starred" />
              <SidebarItem icon={UserIcon} label="Created by me" />
              {/* <SidebarItem icon={Share01Icon} label="Shared with me" /> */}
            </nav>
          </div>

          {pages.length > 0 && (
            <div>
              <h3 className="px-3 text-[10px] font-bold text-landing-ink-faint uppercase tracking-widest mb-2">Recents</h3>
              <nav className="space-y-1">
                {recentPages.map((p) => (
                  <button 
                    key={p._id}
                    onClick={() => router.push(`/project/${p._id}`)}
                    className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-landing-ink-muted hover:bg-landing-bg transition-colors truncate text-left font-[350]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-landing-accent shrink-0" />
                    <span className="truncate">{p.prompt}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-landing-border space-y-3">
          {/* <div className="bg-landing-bg rounded-xl p-3 border border-landing-border animate-in fade-in duration-500">
            <div className="flex justify-between items-start mb-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-landing-border flex items-center justify-center">
                    <HugeiconsIcon icon={GiftIcon} className="w-4 h-4 text-landing-accent" />
                </div>
                <button className="text-[10px] font-bold text-landing-accent uppercase tracking-widest underline">Details</button>
            </div>
            <p className="text-[11px] font-bold mb-1">Share PageForge</p>
            <p className="text-[10px] text-landing-ink-faint leading-tight">Get 100 free credits for every friend you refer.</p>
          </div> */}
          
          <button className="w-full bg-landing-ink text-white rounded-xl p-3 flex items-center justify-between hover:bg-landing-accent transition-all cursor-pointer shadow-landing-sm">
            <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CrownIcon} className="w-4 h-4 text-yellow-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Upgrade to Pro</span>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-3 pt-2">
             {/* <div className="w-7 h-7 rounded-full bg-landing-accent flex items-center justify-center text-white text-[10px] font-bold shadow-landing-sm shrink-0">
                {session?.user?.name?.[0] || "U"}
             </div> */}
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
                    <div className="absolute bottom-[calc(100%+8px)] left-5 w-52 bg-white
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

                      <div className="py-1">
                        <Link href="/dashboard" className="dd-item">
                          <span className="text-landing-ink-muted text-xs">◈</span> dashboard
                        </Link>
                        <button onClick={() => setIsModalOpen(true)} className="dd-item flex items-center gap-2">
                          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" /> new page
                        </button>
                        <Link href="/policy" className="dd-item">
                          <span className="text-landing-ink-muted text-xs">⚖</span> privacy policy
                        </Link>
                      </div>

                      <div className="h-px bg-landing-border" />

                      <div className="py-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="dd-item w-full text-left hover:!bg-red-50 hover:!text-red-500"
                        >
                          <span className="text-xs">→</span> sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
             <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold truncate">{session?.user?.name || "User"}</p>
             </div>
             <button 
                onClick={() => signOut()}
                className="text-[10px] text-landing-ink-faint hover:text-red-500 font-bold uppercase tracking-widest"
             >
                Exit
             </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Top Control Bar (Mobile Toggle + Workspace Switcher) */}
        {/* Mobile Sidebar Toggle (Floating) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-5 left-5 z-20 w-10 h-10 rounded-full border border-landing-border bg-white flex items-center justify-center text-landing-ink hover:bg-landing-bg transition-all cursor-pointer shadow-landing-lg"
          >
            <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
          </button>
        )}

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="w-full min-h-[100vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute rounded-full blur-[60px] pointer-events-none w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(232,82,26,0.25)_0%,transparent_70%)] -top-[100px] -left-[60px]" />
        <div className="absolute rounded-full blur-[60px] pointer-events-none w-[250px] h-[250px] bg-[radial-gradient(circle,rgba(45,91,227,0.2)_0%,transparent_70%)] -bottom-[80px] -right-[40px]" />
            <h1 className="font-instrument text-[clamp(2.5rem,6vw,4.5rem)] tracking-tight leading-none text-landing-ink mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Ready to build, <em className="italic text-landing-accent">{session?.user?.name?.split(' ')[0] || "Adedeji"}?</em>
                </h1>
            <GenerateForm />
          </div>

          {/* Bottom Explorer Section */}
          <div className="w-full max-w-7xl mx-auto px-2 md:px-10 pb-12 mt-auto">
            <div className="bg-white border border-landing-border rounded-[2.5rem] p-2 shadow-landing-lg flex flex-col overflow-hidden">
                {/* Explorer Header/Tabs */}
                {/* <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex gap-8">
                        <TabItem label="Recently viewed" active={activeTab === "Recently viewed"} onClick={() => setActiveTab("Recently viewed")} />
                        <TabItem label="My projects" active={activeTab === "My projects"} onClick={() => setActiveTab("My projects")} />
                        <TabItem label="Templates" active={activeTab === "Templates"} onClick={() => setActiveTab("Templates")} />
                    </div>
                    <button 
                        onClick={() => router.push("/projects")}
                        className="flex items-center gap-2 text-xs font-bold text-landing-ink-faint uppercase tracking-widest hover:text-landing-accent transition-colors"
                    >
                        Browse all <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
                    </button>
                </div> */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-landing-ink-faint">
                        Recently <span className="italic text-landing-accent">viewed</span>
                    </h3>
                </div>
                {/* Recent Projects Grid */}
                <div className="pb-4 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-56 bg-landing-bg rounded-[1.5rem] animate-pulse border border-landing-border" />
                            ))
                        ) : pages.length > 0 ? (
                            pages.slice(0, 3).map((p) => (
                                <ProjectCard key={p._id} page={p} onClick={() => router.push(`/project/${p._id}`)} />
                            ))
                        ) : (
                            <div className="w-full py-12 flex flex-col items-center justify-center text-center col-span-full">
                                <p className="text-landing-ink-faint text-sm">No projects yet. Start by typing above!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Create New Project Modal ─── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-white border border-landing-border rounded-[2.5rem] p-8 relative shadow-landing-lg animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-8 text-landing-ink-muted hover:text-landing-ink transition-colors cursor-pointer text-2xl font-light"
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

      <style>{`
        .dd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          font-size: 11px;
          font-weight: 500;
          color: #6a635a;
          transition: all 0.15s;
          background: transparent;
          border: none;
          font-family: var(--font-dmsans);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          width: 100%;
        }
        .dd-item:hover {
          background: #F9F6F1;
          color: #E8521A;
        }
      `}</style>
    </div>
  );
}

function SidebarItem({ icon, label, active, badge, link = "#" }: { icon: any, label: string, active?: boolean, badge?: string, link?: string }) {
    return (
        <Link href={link} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${active ? 'bg-landing-bg text-landing-ink font-bold shadow-sm' : 'text-landing-ink-muted hover:bg-landing-bg hover:text-landing-ink'}`}>
            <HugeiconsIcon icon={icon} className={`w-4.5 h-4.5 transition-colors ${active ? 'text-landing-accent' : 'text-landing-ink-faint group-hover:text-landing-ink'}`} />
            <span className="flex-1 text-left">{label}</span>
            {badge && <span className="text-[10px] text-landing-ink-faint font-bold border border-landing-border rounded-md px-1 py-0.5">{badge}</span>}
        </Link>
    );
}

function TabItem({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer pb-1 border-b-2 ${active ? 'text-landing-ink border-landing-accent' : 'text-landing-ink-faint border-transparent hover:text-landing-ink'}`}
        >
            {label}
        </button>
    );
}

function ProjectCard({ page, onClick }: { page: Page, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="w-full bg-landing-bg border border-landing-border rounded-[1.5rem] overflow-hidden group hover:border-landing-accent transition-all cursor-pointer flex flex-col h-56"
        >
            <div className="h-full bg-white relative overflow-hidden  ">
                <iframe
                    srcDoc={page.html}
                    className="w-[400%] h-[400%] border-none origin-top-left scale-[0.25] pointer-events-none  group-hover:opacity-100 transition-opacity"
                    title={`P-${page._id}`}
                    scrolling="no"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-landing-bg/50 to-transparent" /> */}
            </div>
            {/* <div className="p-4 flex flex-col flex-1">
                <p className="text-[0.7rem] font-bold text-landing-ink-faint uppercase tracking-widest mb-1">{timeAgo(page.createdAt)}</p>
                <p className="text-sm font-bold text-landing-ink truncate group-hover:text-landing-accent transition-colors">{page.prompt}</p>
            </div> */}
        </div>
    );
}