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
        className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm
                   text-neutral-200 outline-none focus:border-[#e8ff47]
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
  const [step,setSteps] = useState(0);
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
  const field = fields[step];
  const previousStep = () => {
    if (step > 0) {
      setSteps(step - 1);
    }
  };
  const nextStep = () => {
    if (step < fields.length - 1) {
      setSteps(step + 1);
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
        <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-[#e8ff47] w-8 h-8 mb-4" />
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

          {fields.length > 0 && field && (
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Step {step + 1} of {fields.length}
                </span>
                <div className="flex gap-1">
                  {fields.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-4 rounded-full transition-all duration-300 ${
                        i === step ? "bg-[#e8ff47] w-8" : "bg-neutral-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1">
                <Field
                  key={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={answers[field.id] || ""}
                  onChange={(v) => updateAnswer(field.id, v)}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                {step > 0 && (
                  <button 
                    onClick={previousStep}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 
                               font-medium hover:bg-neutral-800 hover:text-neutral-200 transition-all 
                               text-sm flex items-center justify-center gap-2"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={step === fields.length - 1 ? generate : nextStep}
                  className={`flex-[2] py-2.5 rounded-xl font-bold transition-all text-sm
                             shadow-lg flex items-center justify-center gap-2
                             ${step === fields.length - 1 
                               ? "bg-[#e8ff47] text-black hover:bg-[#e8ff47]/50 shadow-[#e8ff47]/10" 
                               : "bg-neutral-100 text-black hover:bg-white"}`}
                >
                  {step === fields.length - 1 
                    ? "Generate" 
                    : (answers[field.id]?.trim() ? "Next" : "Skip")}
                </button>
              </div>
            </div>
          )}

          {!analyzing && fields.length === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-500 text-sm">No additional info needed. Ready to generate!</p>
              <button
                onClick={generate}
                className="mt-4 px-8 py-2.5 bg-[#e8ff47] text-black font-bold rounded-xl
                           hover:bg-[#e8ff47]/50 transition-colors text-sm shadow-lg shadow-[#e8ff47]/10"
              >
                Generate
              </button>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-neutral-500 text-xs font-medium hover:text-neutral-300 transition-colors"
            >
              Cancel and go back
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