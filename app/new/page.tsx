"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReloadIcon } from "@hugeicons/core-free-icons";
import TextIcon from "@/components/texticon";

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
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[0.7rem] font-bold text-landing-ink uppercase tracking-widest ml-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-landing-border rounded-xl px-4 py-4 text-sm
                   text-landing-ink outline-none focus:border-landing-accent
                   transition-all placeholder:text-landing-ink-faint w-full shadow-landing-sm"
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
  const [step, setSteps] = useState(0);
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
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to analyze prompt");
        }

        if (data.fields) {
          setFields(data.fields);
          const initialAnswers: Record<string, string> = {};
          data.fields.forEach((f: DynamicField) => {
            initialAnswers[f.id] = "";
          });
          setAnswers(initialAnswers);
        }
      } catch (err: any) {
        console.error("Failed to analyze prompt", err);
        setError(err.message);
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
    if (step > 0) setSteps(step - 1);
  };
  
  const nextStep = () => {
    if (step < fields.length - 1) setSteps(step + 1);
  };

  if (analyzing) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-landing-bg text-landing-ink px-6">
        <div className="flex flex-col items-center text-center max-w-sm animate-in fade-in duration-1000">
          <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-landing-accent w-12 h-12 mb-8" />
          <h2 className="font-instrument text-4xl mb-4 tracking-tight">Analyzing your idea...</h2>
          <p className="text-landing-ink-muted text-[1.05rem] font-[350] leading-relaxed">
            Our AI is determining the most important details to capture for your custom landing page.
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-landing-bg text-landing-ink px-6">
        <div className="flex flex-col items-center text-center max-w-sm animate-in fade-in duration-700">
          <div className="relative mb-12">
            <div className="w-16 h-16 border-4 border-landing-accent/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-landing-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="font-instrument text-5xl mb-4 tracking-tight">Forging your page</h2>
          <p className="text-landing-ink-muted text-[1.05rem] font-[350] leading-relaxed mb-8">
            Constructing a high-converting masterpiece based on your vision. This usually takes 10-15 seconds.
          </p>
          <div className="w-full h-1 bg-landing-border rounded-full overflow-hidden">
            <div className="h-full bg-landing-accent animate-progress-indefinite" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-landing-bg text-landing-ink px-6 py-12 font-dmsans">
      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <TextIcon/>
          </div>
          <h1 className="font-instrument text-5xl tracking-tight mb-4 text-landing-ink">
            Almost <span className="italic text-landing-accent">there.</span>
          </h1>
          <p className="text-landing-ink-muted text-[1.05rem] font-[350] leading-relaxed max-w-md mx-auto">
            Provide a few more details to make your landing page truly yours, or simply skip to generate.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-landing-border rounded-3xl p-8 md:p-10 shadow-landing-xl">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="bg-landing-bg/50 border border-landing-border rounded-2xl p-5 mb-10 group transition-all hover:bg-white hover:shadow-landing-sm">
            <p className="text-[0.65rem] font-bold text-landing-accent uppercase tracking-widest mb-2">Original Vision</p>
            <p className="text-[0.95rem] text-landing-ink-muted leading-relaxed line-clamp-2 font-[350] italic group-hover:text-landing-ink transition-colors">"{prompt}"</p>
          </div>

          {fields.length > 0 && field && (
            <div className="space-y-10">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[0.7rem] font-bold uppercase tracking-widest text-landing-accent">
                    Step {step + 1} of {fields.length}
                  </span>
                  <p className="text-sm text-landing-ink-faint font-medium mt-1">Refining Details</p>
                </div>
                <div className="flex gap-1.5">
                  {fields.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === step ? "bg-landing-accent w-10 shadow-sm" : "bg-landing-border w-4"
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

              <div className="flex items-center gap-4 pt-4">
                {step > 0 && (
                  <button 
                    onClick={previousStep}
                    className="flex-1 px-4 py-4 rounded-full border border-landing-border text-landing-ink-muted 
                               font-bold hover:bg-landing-bg hover:text-landing-ink transition-all 
                               text-sm flex items-center justify-center gap-2 cursor-pointer shadow-landing-sm"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={step === fields.length - 1 ? generate : nextStep}
                  className={`flex-[2] py-4 rounded-full font-bold transition-all text-sm
                             shadow-landing-md flex items-center justify-center gap-2 cursor-pointer
                             ${step === fields.length - 1 
                               ? "bg-landing-accent text-white hover:bg-landing-accent/90 hover:-translate-y-0.5" 
                               : "bg-landing-ink text-white hover:bg-landing-accent hover:-translate-y-0.5"}`}
                >
                  {step === fields.length - 1 
                    ? "Generate Page" 
                    : (answers[field.id]?.trim() ? "Next" : "Skip")}
                </button>
              </div>
            </div>
          )}

          {!analyzing && fields.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-6 opacity-20">✧</div>
              <p className="text-landing-ink-muted text-[1.05rem] mb-10 leading-relaxed font-[350]">
                We have everything we need to build <br /> your landing page.
              </p>
              <button
                onClick={generate}
                disabled={!!error}
                className={`px-12 py-4 text-white font-bold rounded-full transition-all text-[1.05rem] shadow-landing-md cursor-pointer
                           ${error ? "bg-landing-ink-faint cursor-not-allowed opacity-50" : "bg-landing-accent hover:bg-landing-accent/90 hover:-translate-y-0.5"}`}
              >
                Build it now
              </button>
            </div>
          )}

          <div className="flex justify-center mt-12">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-landing-ink-faint text-xs font-bold uppercase tracking-widest hover:text-landing-accent transition-colors cursor-pointer"
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
        <main className="flex flex-col items-center justify-center min-h-screen bg-landing-bg">
          <HugeiconsIcon icon={ReloadIcon} className="animate-spin text-landing-accent/30 w-12 h-12" />
        </main>
      }
    >
      <NewPageContent />
    </Suspense>
  );
}