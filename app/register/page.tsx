// "use client";
// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, name }),
//     });

//     const data = await res.json();
//     if (!res.ok) {
//       setError(data.error);
//       setLoading(false);
//       return;
//     }

//     // Auto sign in after register
//     await signIn("credentials", { email, password, redirectTo: "/" });
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-neutral-950">
//       <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
//         <h1 className="text-2xl font-black text-white mb-1">
//           Create account
//         </h1>
//         <p className="text-neutral-500 text-sm mb-6">Start building landing pages</p>

//         <form onSubmit={handleRegister} className="flex flex-col gap-3">
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
//                        text-sm text-white outline-none focus:border-[#e8ff47]/50 transition-colors"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
//                        text-sm text-white outline-none focus:border-[#e8ff47]/50 transition-colors"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
//                        text-sm text-white outline-none focus:border-[#e8ff47]/50 transition-colors"
//           />

//           {error && <p className="text-red-400 text-xs">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-[#e8ff47] text-black font-bold py-3 rounded-xl
//                        hover:bg-yellow-200 transition-colors disabled:opacity-40 mt-1"
//           >
//             {loading ? "Creating account..." : "Create account"}
//           </button>
//         </form>

//         <div className="relative my-5">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-neutral-800" />
//           </div>
//           <div className="relative flex justify-center text-xs text-neutral-600">
//             <span className="bg-neutral-900 px-2">or continue with</span>
//           </div>
//         </div>

//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => signIn("google", { redirectTo: "/" })}
//             className="flex items-center justify-center gap-2 bg-neutral-800 border
//                        border-neutral-700 text-white text-sm font-medium py-3 rounded-xl
//                        hover:bg-neutral-700 transition-colors"
//           >
//             <span>🔵</span> Continue with Google
//           </button>
//           <button
//             onClick={() => signIn("github", { redirectTo: "/" })}
//             className="flex items-center justify-center gap-2 bg-neutral-800 border
//                        border-neutral-700 text-white text-sm font-medium py-3 rounded-xl
//                        hover:bg-neutral-700 transition-colors"
//           >
//             <span>⚫</span> Continue with GitHub
//           </button>
//         </div>

//         <p className="text-center text-xs text-neutral-600 mt-6">
//           Already have an account?{" "}
//           <a href="/login" className="text-[#e8ff47] hover:underline">Sign in</a>
//         </p>
//       </div>
//     </main>
//   );
// }
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirectTo: "/" });
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      justifyContent:"center",
      fontFamily: "'DM Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-input {
          width: 100%;
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 13px;
          color: #e0e0e0;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'DM Mono', monospace;
        }
        .reg-input::placeholder { color: #333; }
        .reg-input:focus { border-color: #e8ff47; }

        .oauth-btn {
          width: 100%;
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          padding: 12px 16px;
          color: #999;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.02em;
        }
        .oauth-btn:hover { border-color: #333; color: #ccc; background: #111; }
        .oauth-btn:active { transform: scale(0.98); }

        .submit-btn {
          width: 100%;
          background: #e8ff47;
          color: #000;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Mono', monospace;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: all 0.15s;
        }
        .submit-btn:hover { background: #d4eb3a; }
        .submit-btn:active { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(#1a1a1a 1px, transparent 1px),
            linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.3;
          pointer-events: none;
        }

        .fade-in {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(12px);
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.1s; }
        .d3 { animation-delay: 0.15s; }
        .d4 { animation-delay: 0.2s; }
        .d5 { animation-delay: 0.25s; }
        .d6 { animation-delay: 0.3s; }

        .left-panel {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          border-right: 1px solid #111;
        }
        @media (max-width: 1024px) { .left-panel { display: none; } }
      `}</style>

      {/* Left panel — branding */}
      <div className="left-panel">
        <div className="grid-bg" />

        <div style={{ position: "relative" }}>
          <Link href="/">
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28,
            letterSpacing: "0.05em",
            color: "#fff",
          }}>
            Page<span style={{ color: "#e8ff47" }}>Forge</span>
          </span>
          </Link>
        </div>

        <div style={{ position: "relative", maxWidth: 400 }}>
          <div style={{ width: 32, height: 2, background: "#e8ff47", marginBottom: 24 }} />
          <p style={{
            fontSize: 32,
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            Your landing page is one prompt away.
          </p>
          <p style={{ fontSize: 12, color: "#444", lineHeight: 1.8 }}>
            → Powered by Gemini & GPT-4o<br />
            → One-click HTML download<br />
            → All pages saved to your account
          </p>
        </div>

        <div style={{ position: "relative", display: "flex", gap: 40 }}>
          {[
            { n: "Free", label: "to get started" },
            { n: "~15s", label: "to generate" },
            { n: "∞", label: "pages" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28,
                color: "#e8ff47",
                letterSpacing: "0.03em",
                lineHeight: 1,
              }}>{s.n}</p>
              <p style={{ fontSize: 11, color: "#444", marginTop: 4, letterSpacing: "0.06em" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: "100%",
        maxWidth: 440,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 40px",
        background: "#080808",
      }}>

        {/* Mobile logo */}
        <div style={{ marginBottom: 48, display: "none" }} className="mobile-logo">
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#fff" }}>
            Page<span style={{ color: "#e8ff47" }}>Forge</span>
          </span>
        </div>

        <div className="fade-in d1" style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Get started
          </p>
          <h1 style={{
            fontSize: 28,
            fontWeight: 300,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}>
            Create your<br />
            <span style={{ color: "#e8ff47" }}>account</span>
          </h1>
        </div>

        {/* OAuth */}
        <div className="fade-in d2" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          <button className="oauth-btn" onClick={() => signIn("google", { redirectTo: "/" })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button className="oauth-btn" onClick={() => signIn("github", { redirectTo: "/" })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#ccc">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="fade-in d3" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
          <span style={{ fontSize: 11, color: "#333", letterSpacing: "0.08em" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>
          <div className="fade-in d4" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <input
              className="reg-input"
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <input
              className="reg-input"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div style={{ position: "relative" }}>
              <input
                className="reg-input"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              {password.length > 0 && (
                <div style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  gap: 3,
                }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                      width: 18,
                      height: 3,
                      borderRadius: 2,
                      background: password.length >= i * 3
                        ? i <= 1 ? "#ff4444"
                        : i <= 2 ? "#ffaa00"
                        : i <= 3 ? "#88cc00"
                        : "#e8ff47"
                        : "#222",
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="fade-in" style={{
              background: "#1a0a0a",
              border: "1px solid #3a1a1a",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 12,
              color: "#ff6b6b",
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <div className="fade-in d5">
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "creating account..." : "create account →"}
            </button>
          </div>
        </form>

        <div className="fade-in d6" style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link
            href="/login"
            style={{ fontSize: 12, color: "#444", textDecoration: "none", transition: "color 0.15s" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#e8ff47")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#444")}
          >
            Have an account? Sign in →
          </Link>
          <span style={{ fontSize: 11, color: "#2a2a2a" }}>v1.0</span>
        </div>
      </div>
    </main>
  );
}