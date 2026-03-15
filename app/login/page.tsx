"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

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

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-950">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <h1 className="text-2xl font-black text-white mb-1">
          Welcome back
        </h1>
        <p className="text-neutral-500 text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
                       text-sm text-white outline-none focus:border-yellow-300/50 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3
                       text-sm text-white outline-none focus:border-yellow-300/50 transition-colors"
          />

          {(error || authError) && (
            <p className="text-red-400 text-xs">
              {error || (authError === "CredentialsSignin" ? "Invalid email or password" : "Authentication failed")}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-300 text-black font-bold py-3 rounded-xl
                       hover:bg-yellow-200 transition-colors disabled:opacity-40 mt-1"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs text-neutral-600">
            <span className="bg-neutral-900 px-2">or continue with</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex items-center justify-center gap-2 bg-neutral-800 border
                       border-neutral-700 text-white text-sm font-medium py-3 rounded-xl
                       hover:bg-neutral-700 transition-colors"
          >
            <span>🔵</span> Continue with Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="flex items-center justify-center gap-2 bg-neutral-800 border
                       border-neutral-700 text-white text-sm font-medium py-3 rounded-xl
                       hover:bg-neutral-700 transition-colors"
          >
            <span>⚫</span> Continue with GitHub
          </button>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-yellow-300 hover:underline">Create one</a>
        </p>
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
