"use client";
import { useState, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Link01Icon,
  CopyCheckIcon,
  CopyIcon,
  ReloadIcon,
} from "@hugeicons/core-free-icons";

interface ProjectSettingsProps {
  projectId: string;
  initialTitle: string;
  initialSlug: string;
  initialCustomDomain: string;
  initialDomainVerified: boolean;
  initialDeploymentStatus: "live" | "paused" | "draft";
  initialLastDeployedAt: string;
  onClose: () => void;
  onProjectDeleted: () => void;
  onSettingsUpdate: (data: ProjectSettingsUpdate) => void;
}

interface ProjectSettingsUpdate {
  slug?: string;
  customDomain?: string;
  domainVerified?: boolean;
  deploymentStatus?: "live" | "paused" | "draft";
  lastDeployedAt?: string;
}

type ProjectUpdatePayload = ProjectSettingsUpdate & {
  title?: string;
};

function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  return error instanceof Error ? error.message : fallback;
}

export default function ProjectSettings({
  projectId,
  initialSlug,
  initialCustomDomain,
  initialDomainVerified,
  initialDeploymentStatus,
  initialLastDeployedAt,
  onClose,
  onProjectDeleted,
  onSettingsUpdate,
}: ProjectSettingsProps) {
  const cnameTarget =
    process.env.NEXT_PUBLIC_VERCEL_CNAME_TARGET || "cname.vercel-dns.com";
  const apexARecord = process.env.NEXT_PUBLIC_VERCEL_A_RECORD || "76.76.21.21";

  const [slug, setSlug] = useState(initialSlug || "");
  const [customDomain, setCustomDomain] = useState(initialCustomDomain || "");
  const [domainVerified, setDomainVerified] = useState(initialDomainVerified);
  const [deploymentStatus, setDeploymentStatus] = useState<"live" | "paused" | "draft">(initialDeploymentStatus);
  const [lastDeployedAt, setLastDeployedAt] = useState(initialLastDeployedAt || "");

  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [domainError, setDomainError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [deleteTyped, setDeleteTyped] = useState("");

  // Slug availability check
  type SlugCheckState = "idle" | "checking" | "available" | "taken" | "reserved" | "invalid" | "too_short" | "too_long" | "empty";
  const [slugCheck, setSlugCheck] = useState<SlugCheckState>("idle");

  const panelRef = useRef<HTMLDivElement>(null);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  const slugDebounce = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, type });
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
  };

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Debounced slug availability check
  useEffect(() => {
    if (slugDebounce.current) clearTimeout(slugDebounce.current);
    const trimmed = slug.trim();
    if (!trimmed) {
      setSlugCheck("idle");
      return;
    }
    // Instant local checks before hitting API
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(trimmed)) {
      setSlugCheck("invalid");
      return;
    }
    if (trimmed.length < 3) { setSlugCheck("too_short"); return; }
    if (trimmed.length > 48) { setSlugCheck("too_long"); return; }
    // If unchanged from saved value, skip network call
    if (trimmed === initialSlug) {
      setSlugCheck("available");
      return;
    }
    setSlugCheck("checking");
    slugDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/projects/check-slug?slug=${encodeURIComponent(trimmed)}&projectId=${projectId}`
        );
        const data = await res.json();
        if (data.available) {
          setSlugCheck("available");
        } else {
          setSlugCheck(data.reason as SlugCheckState || "taken");
        }
      } catch {
        setSlugCheck("idle");
      }
    }, 500);
    return () => { if (slugDebounce.current) clearTimeout(slugDebounce.current); };
  }, [slug, projectId, initialSlug]);

  const slugCheckMessage: Record<string, { text: string; color: string }> = {
    available:  { text: "✓ Available", color: "text-emerald-600" },
    taken:      { text: "✗ Already taken — choose a different slug", color: "text-red-500" },
    reserved:   { text: "✗ Reserved by Celerify — choose a different slug", color: "text-red-500" },
    invalid:    { text: "✗ Only lowercase letters, numbers and hyphens", color: "text-amber-600" },
    too_short:  { text: "✗ Minimum 3 characters", color: "text-amber-600" },
    too_long:   { text: "✗ Maximum 48 characters", color: "text-amber-600" },
    checking:   { text: "Checking availability…", color: "text-landing-ink-faint" },
    idle:       { text: "", color: "" },
  };
  const slugAvailable = slugCheck === "available";

  const updateProject = async (data: ProjectUpdatePayload) => {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Update failed");
    return result;
  };

  // ── Deploy / Redeploy ──
  const handleDeploy = async () => {
    if (!slug.trim()) {
      setSlugError("Please enter a deployment slug first");
      return;
    }
    setSlugError("");
    setDeploying(true);
    try {
      const now = new Date().toISOString();
      await updateProject({
        slug: slug.trim().toLowerCase(),
        deploymentStatus: "live",
        lastDeployedAt: now,
      });
      setDeploymentStatus("live");
      setLastDeployedAt(now);
      onSettingsUpdate({ slug, deploymentStatus: "live", lastDeployedAt: now });
      showToast("Project deployed successfully!");
    } catch (error) {
      const message = getErrorMessage(error, "Deploy failed");
      setSlugError(message);
      showToast(message, "error");
    } finally {
      setDeploying(false);
    }
  };

  // ── Pause / Resume ──
  const toggleDeployment = async () => {
    const newStatus = deploymentStatus === "live" ? "paused" : "live";
    setSaving(true);
    try {
      await updateProject({ deploymentStatus: newStatus });
      setDeploymentStatus(newStatus);
      onSettingsUpdate({ deploymentStatus: newStatus });
      showToast(newStatus === "live" ? "Deployment resumed!" : "Deployment paused");
    } catch (error) {
      showToast(getErrorMessage(error, "Deployment update failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Custom domain ──
  // domainInput is the draft value in the text field; customDomain is the saved/committed value.
  const [domainInput, setDomainInput] = useState(initialCustomDomain || "");

  const handleSaveDomain = async () => {
    const trimmed = domainInput
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/\.$/, "");
    if (!trimmed) {
      setDomainError("Please enter a domain");
      return;
    }
    const domainPattern = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!domainPattern.test(trimmed)) {
      setDomainError("Please enter a valid domain (e.g. www.example.com)");
      return;
    }
    setDomainError("");
    setSaving(true);
    try {
      await updateProject({ customDomain: trimmed, domainVerified: false });
      setCustomDomain(trimmed);
      setDomainInput(trimmed);
      setDomainVerified(false);
      onSettingsUpdate({ customDomain: trimmed, domainVerified: false });
      showToast("Domain saved! Add the DNS records below, then verify.");
    } catch (error) {
      setDomainError(getErrorMessage(error, "Domain update failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    setVerifyingDomain(true);
    try {
      const res = await fetch("/api/projects/verify-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification request failed");
      }

      if (data.verified) {
        setDomainVerified(true);
        onSettingsUpdate({ domainVerified: true });
        showToast("Domain verified successfully! 🎉");
      } else {
        const message = data.hint
          ? `${data.error}. ${data.hint}`
          : data.error || "DNS record not found — check your CNAME settings";
        showToast(message, "error");
      }
    } catch (error) {
      showToast(getErrorMessage(error, "Verification request failed"), "error");
    } finally {
      setVerifyingDomain(false);
    }
  };

  const handleRemoveDomain = async () => {
    setSaving(true);
    try {
      await updateProject({ customDomain: "", domainVerified: false });
      setCustomDomain("");
      setDomainInput("");
      setDomainVerified(false);
      onSettingsUpdate({ customDomain: "", domainVerified: false });
      showToast("Domain removed");
    } catch (error) {
      showToast(getErrorMessage(error, "Domain removal failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete project ──
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onProjectDeleted();
    } catch (error) {
      showToast(getErrorMessage(error, "Delete failed"), "error");
      setDeleting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText((prev) => (prev === text ? "" : prev));
    }, 2000);
  };

  const deployUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}` : "";
  const domainParts = customDomain.split(".");
  const dnsRecordName =
    domainParts.length > 2
      ? domainParts[0]
      : customDomain.startsWith("www.")
        ? "www"
        : "@";
  const isLikelyApexDomain = customDomain && domainParts.length === 2;

  const statusConfig = {
    live: { color: "bg-emerald-500", ring: "ring-emerald-500/20", text: "text-emerald-600", label: "Live", bgLight: "bg-emerald-50" },
    paused: { color: "bg-amber-500", ring: "ring-amber-500/20", text: "text-amber-600", label: "Paused", bgLight: "bg-amber-50" },
    draft: { color: "bg-landing-ink-faint", ring: "ring-landing-ink-faint/20", text: "text-landing-ink-faint", label: "Draft", bgLight: "bg-landing-bg" },
  };
  const status = statusConfig[deploymentStatus];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] settings-backdrop-enter"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white z-[101] shadow-2xl flex flex-col settings-panel-enter"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-landing-border bg-white/80 backdrop-blur-md shrink-0">
          <div>
            <h2 className="text-lg font-bold text-landing-ink tracking-tight">Project Settings</h2>
            <p className="text-[11px] text-landing-ink-faint mt-0.5 font-medium">
              Configure deployment, domains &amp; more
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-landing-bg hover:bg-landing-border/60 transition-all text-landing-ink-muted hover:text-landing-ink cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">

          {/* ════════ Status Badge ════════ */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgLight} border border-current/5`}>
              <span className={`w-2 h-2 rounded-full ${status.color} ${deploymentStatus === "live" ? "animate-pulse" : ""} ring-4 ${status.ring}`} />
              <span className={`text-xs font-bold ${status.text} uppercase tracking-widest`}>
                {status.label}
              </span>
            </div>
            {lastDeployedAt && (
              <span className="text-[10px] text-landing-ink-faint font-medium">
                Last deployed {new Date(lastDeployedAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </span>
            )}
          </div>

          {/* ════════ Deployment Section ════════ */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-landing-accent/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-landing-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <h3 className="text-[0.8rem] font-bold text-landing-ink tracking-tight">Deployment</h3>
            </div>

            <div className="bg-landing-bg/60 rounded-2xl p-5 border border-landing-border space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-landing-ink-faint block mb-2">
                  Deployment Slug
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-white border border-landing-border rounded-xl overflow-hidden shadow-landing-sm focus-within:border-landing-accent/40 focus-within:shadow-landing-md transition-all">
                    <span className="pl-4 pr-1 text-xs text-landing-ink-faint font-medium whitespace-nowrap select-none">/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        setSlugError("");
                      }}
                      placeholder="my-portfolio"
                      className="flex-1 py-3 pr-4 text-sm text-landing-ink bg-transparent outline-none placeholder:text-landing-ink-faint/50 font-medium"
                    />
                    {/* Inline availability indicator */}
                    {slug && (
                      <span className="pr-3 shrink-0">
                        {slugCheck === "checking" ? (
                          <svg className="w-3.5 h-3.5 text-landing-ink-faint animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                          </svg>
                        ) : slugCheck === "available" ? (
                          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : slugCheck !== "idle" ? (
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : null}
                      </span>
                    )}
                  </div>
                </div>
                {/* Availability message */}
                {slug && slugCheckMessage[slugCheck]?.text && (
                  <p className={`text-[10px] mt-1.5 font-medium ${slugCheckMessage[slugCheck].color}`}>
                    {slugCheckMessage[slugCheck].text}
                  </p>
                )}
                {slugError && (
                  <p className="text-[10px] text-red-500 mt-1.5 font-medium animate-shake">{slugError}</p>
                )}
                {slug && slugAvailable && !slugError && (
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <span className="text-[10px] text-landing-ink-faint">Preview:</span>
                    <span className="text-[10px] text-landing-accent font-bold font-mono truncate">
                      {typeof window !== "undefined" ? window.location.origin : ""}/{slug}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDeploy}
                  disabled={deploying || !slug.trim() || !slugAvailable}
                  className="flex-1 bg-landing-ink text-white font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-landing-md hover:bg-landing-accent hover:-translate-y-0.5 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {deploying ? (
                    <>
                      <HugeiconsIcon icon={ReloadIcon} className="w-3.5 h-3.5 animate-spin" />
                      Deploying…
                    </>
                  ) : deploymentStatus !== "draft" ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                      Redeploy
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                      Deploy
                    </>
                  )}
                </button>
                {deploymentStatus !== "draft" && (
                  <button
                    onClick={toggleDeployment}
                    disabled={saving}
                    className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      deploymentStatus === "live"
                        ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {saving ? (
                      <HugeiconsIcon icon={ReloadIcon} className="w-3.5 h-3.5 animate-spin" />
                    ) : deploymentStatus === "live" ? (
                      "Pause"
                    ) : (
                      "Resume"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Deployed URL */}
            {deploymentStatus !== "draft" && slug && (
              <div className="flex items-center gap-2 bg-white border border-landing-border rounded-xl p-2 pl-4 shadow-landing-sm">
                <HugeiconsIcon icon={Link01Icon} className="w-3.5 h-3.5 text-landing-ink-faint shrink-0" />
                <span className="flex-1 text-xs text-landing-ink-muted font-mono truncate">{deployUrl}</span>
                <button
                  onClick={() => copyToClipboard(deployUrl)}
                  className="p-2.5 bg-landing-bg rounded-lg hover:bg-landing-accent hover:text-white transition-all text-landing-ink-muted cursor-pointer"
                >
                  <HugeiconsIcon icon={copiedText === deployUrl ? CopyCheckIcon : CopyIcon} className="w-3 h-3" />
                </button>
              </div>
            )}
          </section>

          <div className="h-px bg-landing-border" />

          {/* ════════ Custom Domain ════════ */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2D5BE3]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2D5BE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-[0.8rem] font-bold text-landing-ink tracking-tight">Custom Domain</h3>
            </div>

            <div className="bg-landing-bg/60 rounded-2xl p-5 border border-landing-border space-y-4">
              {!customDomain ? (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-landing-ink-faint block mb-2">
                      Domain Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={domainInput}
                        onChange={(e) => {
                          setDomainInput(e.target.value);
                          setDomainError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && domainInput.trim()) handleSaveDomain();
                        }}
                        placeholder="www.myproject.com"
                        className="flex-1 bg-white border border-landing-border rounded-xl px-4 py-3 text-sm text-landing-ink outline-none placeholder:text-landing-ink-faint/50 shadow-landing-sm focus:border-landing-accent/40 focus:shadow-landing-md transition-all font-medium"
                      />
                      <button
                        onClick={handleSaveDomain}
                        disabled={saving || !domainInput.trim()}
                        className="px-5 py-3 bg-landing-ink text-white rounded-xl font-bold text-xs hover:bg-landing-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {saving ? (
                          <HugeiconsIcon icon={ReloadIcon} className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                    {domainError && (
                      <p className="text-[10px] text-red-500 mt-1.5 font-medium animate-shake">{domainError}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Domain display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${domainVerified ? "bg-emerald-500 ring-4 ring-emerald-500/20" : "bg-amber-500 ring-4 ring-amber-500/20"}`} />
                      <div>
                        <p className="text-sm font-bold text-landing-ink">{customDomain}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${domainVerified ? "text-emerald-600" : "text-amber-600"}`}>
                          {domainVerified ? "Verified" : "Pending Verification"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveDomain}
                      disabled={saving}
                      className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase tracking-widest cursor-pointer disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>

                  {/* DNS Instructions */}
                  {!domainVerified && (
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-4 border border-landing-border space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-landing-ink-faint">
                          Add this DNS record
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          <div>
                            <p className="text-landing-ink-faint font-medium">Type</p>
                            <p className="font-bold text-landing-ink font-mono mt-0.5">
                              {isLikelyApexDomain ? "A" : "CNAME"}
                            </p>
                          </div>
                          <div>
                            <p className="text-landing-ink-faint font-medium">Name</p>
                            <div className="flex items-center gap-1 group mt-0.5">
                              <p className="font-bold text-landing-ink font-mono truncate">{dnsRecordName}</p>
                              <button
                                onClick={() => copyToClipboard(dnsRecordName)}
                                className="p-1 rounded text-landing-ink-faint hover:bg-landing-border/60 hover:text-landing-ink transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 -ml-0.5"
                                title="Copy Name"
                              >
                                <HugeiconsIcon icon={copiedText === dnsRecordName ? CopyCheckIcon : CopyIcon} className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-landing-ink-faint font-medium">Value</p>
                            <div className="flex items-center gap-1 group mt-0.5">
                              <p className="font-bold text-landing-accent font-mono truncate">
                                {isLikelyApexDomain ? apexARecord : cnameTarget}
                              </p>
                              <button
                                onClick={() => copyToClipboard(isLikelyApexDomain ? apexARecord : cnameTarget)}
                                className="p-1 rounded text-landing-ink-faint hover:bg-landing-border/60 hover:text-landing-accent transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 -ml-0.5"
                                title="Copy Value"
                              >
                                <HugeiconsIcon icon={copiedText === (isLikelyApexDomain ? apexARecord : cnameTarget) ? CopyCheckIcon : CopyIcon} className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {!isLikelyApexDomain && dnsRecordName !== "www" && (
                          <p className="text-[10px] text-landing-ink-faint leading-relaxed">
                            If your DNS provider asks for the full host, use {customDomain}.
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleVerifyDomain}
                        disabled={verifyingDomain}
                        className="w-full bg-[#2D5BE3] text-white font-bold py-3 rounded-xl text-xs hover:bg-[#2D5BE3]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      >
                        {verifyingDomain ? (
                          <>
                            <HugeiconsIcon icon={ReloadIcon} className="w-3.5 h-3.5 animate-spin" />
                            Verifying…
                          </>
                        ) : (
                          "Verify Domain"
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="h-px bg-landing-border" />

          {/* ════════ Danger Zone ════════ */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.194-.833-2.964 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-[0.8rem] font-bold text-red-600 tracking-tight">Danger Zone</h3>
            </div>

            <div className="rounded-2xl p-5 border-2 border-dashed border-red-200 bg-red-50/40 space-y-4">
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-landing-ink">Delete Project</p>
                    <p className="text-[11px] text-landing-ink-faint leading-relaxed mt-0.5">
                      Permanently remove this project and all its data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-5 py-2.5 border-2 border-red-300 text-red-600 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer shrink-0 ml-4"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-up" style={{ animationDuration: "0.3s" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-700">Are you absolutely sure?</p>
                      <p className="text-[11px] text-red-600/70 leading-relaxed mt-1">
                        This will permanently delete your project, deployment, custom domain settings, and all associated data.
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-red-500 block mb-1.5">
                      Type &quot;DELETE&quot; to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteTyped}
                      onChange={(e) => setDeleteTyped(e.target.value)}
                      placeholder="DELETE"
                      className="w-full bg-white border-2 border-red-200 rounded-xl px-4 py-2.5 text-sm text-landing-ink outline-none focus:border-red-400 transition-all font-mono placeholder:text-red-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteTyped("");
                      }}
                      className="flex-1 py-3 bg-landing-bg text-landing-ink-muted rounded-xl font-bold text-xs hover:bg-landing-border/60 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteTyped !== "DELETE" || deleting}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      {deleting ? (
                        <>
                          <HugeiconsIcon icon={ReloadIcon} className="w-3.5 h-3.5 animate-spin" />
                          Deleting…
                        </>
                      ) : (
                        "Delete Forever"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`absolute bottom-6 left-6 right-6 px-5 py-3.5 rounded-2xl text-xs font-bold shadow-landing-lg flex items-center gap-2 settings-toast-enter ${
              toast.type === "success"
                ? "bg-landing-ink text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
}
