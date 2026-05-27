import { generateJsonWithFallback } from "./fallback";

export interface PagePlan {
  name: string;
  path: string;
  sections: string[];
}

export interface LayoutPlan {
  pages: PagePlan[];
}

const SYSTEM_PROMPT = `You are an expert UX architect. Based on the product analysis, plan a multi-page website layout using predefined rigid components.
Available components: ["Navbar", "Hero", "FeaturesGrid", "BentoBox", "Stats", "Testimonials", "Pricing", "FAQ", "CTA", "Footer", "ContentSection"].

Return ONLY valid JSON. 
Format:
{
  "pages": [
    {
      "name": "Home",
      "path": "/",
      "sections": ["Navbar", "Hero", "FeaturesGrid", "Pricing", "Footer"]
    }
  ]
}
Ensure the layout flows logically for conversion. Generate at least a Home page, and up to 2 additional pages (e.g., Pricing, About).`;

export async function planLayout(analysis: any): Promise<LayoutPlan> {
  return generateJsonWithFallback(SYSTEM_PROMPT, JSON.stringify(analysis), 0.7);
}
