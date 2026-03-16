"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TextIcon from "@/components/texticon";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  };

  return (
    <main className="min-h-screen bg-landing-bg flex flex-col lg:flex-row font-dmsans">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-16 border-r border-landing-border bg-white/40 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1A1714_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Logo */}
        <div className="relative z-10">
          <TextIcon/>
        </div>

        {/* Center quote */}
        <div className="relative z-10 max-w-md">
          <div className="w-10 h-1 bg-landing-accent rounded-full mb-8" />
          <h2 className="font-instrument text-5xl text-landing-ink leading-tight tracking-tight mb-8">
            From idea to <br />
            <em className="italic text-landing-accent not-italic">landing page</em> in seconds.
          </h2>
          <p className="text-landing-ink-muted text-base font-[350] leading-relaxed">
            Describe your product in plain English. <br />
            We handle the design, copy, and code.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-12">
          {[
            { n: "~15s", label: "avg generation" },
            { n: "100%", label: "yours to keep" },
            { n: "2+", label: "AI providers" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-instrument text-3xl text-landing-ink leading-none">{s.n}</p>
              <p className="text-[0.65rem] text-landing-ink-faint mt-2 uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center p-8 md:p-16 bg-landing-bg">
        {/* Mobile logo */}
        <div className="mb-12 lg:hidden">
          <TextIcon/>
        </div>

        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-[0.7rem] font-bold text-landing-accent uppercase tracking-[0.2em] mb-4">
            Welcome back
          </p>
          <h1 className="font-instrument text-4xl text-landing-ink tracking-tight leading-none mb-3">
            Sign in to your <br />
            <span className="italic text-landing-accent">account</span>
          </h1>
        </div>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <button 
            className="flex items-center justify-center gap-3 w-full bg-white border border-landing-border rounded-xl py-3.5 px-4 text-sm font-medium text-landing-ink hover:border-landing-accent transition-all cursor-pointer shadow-landing-sm hover:shadow-landing-md"
            onClick={() => signIn("google", { callbackUrl })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button 
            className="flex items-center justify-center gap-3 w-full bg-white border border-landing-border rounded-xl py-3.5 px-4 text-sm font-medium text-landing-ink hover:border-landing-accent transition-all cursor-pointer shadow-landing-sm hover:shadow-landing-md"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8 animate-in fade-in duration-700 delay-200">
          <div className="flex-1 h-px bg-landing-border" />
          <span className="text-[0.65rem] text-landing-ink-faint font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-landing-border" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div>
            <label className="block text-[0.7rem] font-bold text-landing-ink tracking-widest uppercase mb-2 ml-1">Email address</label>
            <input
              className="w-full bg-white border border-landing-border rounded-xl py-3.5 px-4 text-sm text-landing-ink outline-none focus:border-landing-accent transition-all"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-[0.7rem] font-bold text-landing-ink tracking-widest uppercase mb-2 ml-1">Password</label>
            <input
              className="w-full bg-white border border-landing-border rounded-xl py-3.5 px-4 text-sm text-landing-ink outline-none focus:border-landing-accent transition-all"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {(error || authError) && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-600 font-medium animate-in shake duration-300">
              {error || (authError === "CredentialsSignin" ? "Invalid email or password" : "Authentication failed")}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-landing-ink text-white rounded-full py-4 text-sm font-bold tracking-wide transition-all hover:bg-landing-accent hover:-translate-y-0.5 shadow-landing-md disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in duration-700 delay-400">
          <p className="text-sm text-landing-ink-muted">
            Don't have an account?{" "}
            <Link href="/register" className="text-landing-accent font-bold hover:underline">
              Register now
            </Link>
          </p>
          <div className="h-px w-8 bg-landing-border" />
          <span className="text-[0.65rem] text-landing-ink-faint font-bold tracking-widest uppercase">v1.2.0 • PageForge AI</span>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}