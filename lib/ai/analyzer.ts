import { generateJsonWithFallback } from "./fallback";

export interface AnalysisResult {
  industry: string;
  targetAudience: string;
  tone: string;
  visualStyle: string;
  features: string[];
  suggestedSections: string[];
}

const SYSTEM_PROMPT = `You are an expert product strategist and AI web designer. Analyze the user's prompt for a landing page and extract the core product details.
Return ONLY valid JSON.
Format:
{
  "industry": "e.g. SaaS, E-commerce, Crypto, Agency, Personal Brand",
  "targetAudience": "Who is this for?",
  "tone": "e.g. Professional, Playful, Futuristic, Trustworthy, Minimalist",
  "visualStyle": "Describe the ideal aesthetic (e.g., Premium dark mode with neon accents, Clean white with soft shadows)",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "suggestedSections": ["Navbar", "Hero", "Features", "Testimonials", "Pricing", "CTA", "Footer"]
}`;

export async function analyzePrompt(prompt: string): Promise<AnalysisResult> {
  return generateJsonWithFallback(SYSTEM_PROMPT, prompt, 0.7);
}
