"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReloadIcon } from "@hugeicons/core-free-icons";

interface DynamicField {
  id: string;
  label: string;
  placeholder: string;
}

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

function NewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptFromUrl = searchParams.get("prompt") || "";

  useEffect(() => {
    if (!promptFromUrl.trim()) {
      router.replace("/");
    }
  }, [promptFromUrl, router]);

  const [prompt] = useState(promptFromUrl);
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFields() {
      if (!promptFromUrl.trim()) return;
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptFromUrl }),
        });
        const data = await res.json();
        if (data.fields) {
          setFields(data.fields);
          // Initialize empty answers
          const initialAnswers: Record<string, string> = {};
          data.fields.forEach((f: DynamicField) => {
            initialAnswers[f.id] = "";
          });
          setAnswers(initialAnswers);
        }
      } catch (err) {
        console.error("Failed to analyze prompt", err);
      } finally {
        setAnalyzing(false);
      }
    }
    loadFields();
  }, [promptFromUrl]);

  const updateAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    // Build the filled details from dynamic fields using their actual labels
    const filledDetails = fields
      .map((f) => ({ label: f.label, value: answers[f.id]?.trim() }))
      .filter((item) => item.value)
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");

    const fullPrompt = filledDetails
      ? `${prompt}\n\nUser Context/Details (incorporate these into the page design where relevant):\n${filledDetails}`
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
        router.push(`/project/${data.id}`);
      } else {
        throw new Error("Failed to retrieve generated project ID.");
      }
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  if (analyzing) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 px-6">
        <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-neutral-600 w-8 h-8 mb-4" />
        <p className="font-semibold text-lg text-neutral-300">Analyzing your idea...</p>
        <p className="text-neutral-500 text-sm mt-1">Determining the best data to ask for.</p>
      </main>
    );
  }

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
              {fields.map((field) => (
                <Field
                  key={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={answers[field.id] || ""}
                  onChange={(v) => updateAnswer(field.id, v)}
                />
              ))}
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

export default function NewPage() {
  return (
    <Suspense 
      fallback={
        <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 px-6">
          <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-neutral-600 w-8 h-8 mb-4" />
        </main>
      }
    >
      <NewPageContent />
    </Suspense>
  );
}