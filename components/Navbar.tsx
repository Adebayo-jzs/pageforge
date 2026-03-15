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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U";

  const navLinks = [
    { label: "privacy policy", href: "/policy" },
    { label: "how it works", href: "/how-it-works" },
  ];

  return (
    <nav style={{
      height: 52,
      background: "#080808",
      borderBottom: "1px solid #141414",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      fontFamily: "'DM Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');

        .nav-link {
          font-size: 12px;
          color: #444;
          text-decoration: none;
          letter-spacing: 0.03em;
          padding: 5px 10px;
          border-radius: 6px;
          transition: all 0.15s;
          cursor: pointer;
          background: transparent;
          border: none;
          font-family: 'DM Mono', monospace;
        }
        .nav-link:hover { color: #ccc; background: #111; }
        .nav-link.active { color: #e8ff47; }

        .new-btn {
          background: #e8ff47;
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 11px;
          font-weight: 500;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .new-btn:hover { background: #d4eb3a; }
        .new-btn:active { transform: scale(0.97); }

        .avatar-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #e8ff47;
          font-size: 11px;
          font-weight: 500;
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.05em;
        }
        .avatar-btn:hover { border-color: #e8ff47; background: #1e1e1a; }

        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 12px;
          min-width: 200px;
          overflow: hidden;
          animation: dropIn 0.15s ease forwards;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          font-size: 12px;
          color: #888;
          cursor: pointer;
          transition: all 0.1s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
          text-decoration: none;
        }
        .dropdown-item:hover { background: #161616; color: #ccc; }
        .dropdown-item.danger:hover { background: #1a0a0a; color: #ff6b6b; }
        .dropdown-divider {
          height: 1px;
          background: #1a1a1a;
          margin: 4px 0;
        }
      `}</style>

      {/* Left — logo + nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Logo size="sm" />

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${pathname === link.href ? " active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        {session && (
          <Link 
            href="/dashboard"
            className={`nav-link${pathname === "dashboard" ? " active" : ""}`}
          >
            dashboard
          </Link>
        )}
      </div>

      {/* Right — new page + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {session ? (
          <>
            <button className="new-btn" onClick={() => router.push("/")}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
              new page
            </button>

            {/* Avatar dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                className="avatar-btn"
                onClick={() => setDropdownOpen((v) => !v)}
                title={session?.user?.email ?? "Account"}
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="dropdown">
                  {/* User info */}
                  <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #1a1a1a" }}>
                    <p style={{ fontSize: 12, color: "#ccc", marginBottom: 2 }}>
                      {session?.user?.name ?? "User"}
                    </p>
                    <p style={{
                      fontSize: 11,
                      color: "#444",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Links */}
                  <div style={{ padding: "4px 0" }}>
                    <Link href="/dashboard" className="dropdown-item">
                      <span>◈</span> dashboard
                    </Link>
                    <Link href="/" className="dropdown-item">
                      <span>+</span> new page
                    </Link>
                    <Link href="/policy" className="dropdown-item">
                      <span>⚖</span> privacy policy
                    </Link>
                  </div>

                  <div className="dropdown-divider" />

                  <div style={{ padding: "4px 0" }}>
                    <button
                      className="dropdown-item danger"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      <span>→</span> sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/login" className="nav-link">sign in</Link>
            <Link 
              href="/register" 
              className="new-btn"
              style={{ padding: "7px 16px" }}
            >
              get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}