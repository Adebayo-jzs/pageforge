"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReloadIcon } from "@hugeicons/core-free-icons";

interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  github: string;
  website: string;
}

const EMPTY_DETAILS: BusinessDetails = {
  name: "",
  email: "",
  phone: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  github: "",
  website: "",
};

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[11px] text-neutral-500 font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm
                   text-neutral-200 outline-none focus:border-yellow-300/50
                   transition-colors placeholder:text-neutral-700 w-full"
      />
    </div>
  );
}

export default function NewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptFromUrl = searchParams.get("prompt") || "";

  useEffect(() => {
    if (!promptFromUrl.trim()) {
      router.replace("/");
    }
  }, [promptFromUrl, router]);

  const [prompt] = useState(promptFromUrl);
  const [details, setDetails] = useState<BusinessDetails>(EMPTY_DETAILS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateDetail = (key: keyof BusinessDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    const filledDetails = Object.entries(details)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const fullPrompt = filledDetails
      ? `${prompt}\n\nBusiness/Contact Details (use these in the page where appropriate):\n${filledDetails}`
      : prompt;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.id) {
        // Redirect completely to the new workspace route
        router.push(`/project/${data.id}`);
      } else {
        throw new Error("Failed to retrieve generated project ID.");
      }
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 px-6">
        <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-yellow-300 w-8 h-8 mb-4" />
        <p className="font-semibold text-lg">Forging your page...</p>
        <p className="text-neutral-500 text-sm mt-1">This takes about 10-15 seconds.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Almost there.
          </h1>
          <p className="text-neutral-400 text-sm">
            Add any contact info or socials you want included, or just skip it.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          {error && (
            <div className="bg-red-950/50 border border-red-900 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 mb-6">
            <p className="text-[11px] text-neutral-500 font-medium mb-1">Your Prompt</p>
            <p className="text-xs text-neutral-300 line-clamp-2">{prompt}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Business / Brand Name" placeholder="Acme Corp" value={details.name} onChange={(v) => updateDetail("name", v)} />
              <Field label="Email" placeholder="hello@acme.com" value={details.email} onChange={(v) => updateDetail("email", v)} />
              <Field label="Phone" placeholder="+1 (555) 123-4567" value={details.phone} onChange={(v) => updateDetail("phone", v)} />
              <Field label="Website" placeholder="https://acme.com" value={details.website} onChange={(v) => updateDetail("website", v)} />
            </div>

            <div className="flex items-center gap-2 py-2">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-600">Social Links</span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Twitter / X" placeholder="@acmecorp" value={details.twitter} onChange={(v) => updateDetail("twitter", v)} />
              <Field label="Instagram" placeholder="@acmecorp" value={details.instagram} onChange={(v) => updateDetail("instagram", v)} />
              <Field label="LinkedIn" placeholder="company/acme-corp" value={details.linkedin} onChange={(v) => updateDetail("linkedin", v)} />
              <Field label="GitHub" placeholder="acmecorp" value={details.github} onChange={(v) => updateDetail("github", v)} />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 
                         font-medium hover:bg-neutral-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={generate}
              className="flex-1 bg-yellow-300 text-black font-bold py-2.5 rounded-xl
                         hover:bg-yellow-200 transition-colors text-sm shadow-lg shadow-yellow-300/10"
            >
              Generate Page →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}