import { AnalysisResult } from "./analyzer";
import { BrandConfig } from "./brand";
import { PagePlan } from "./planner";
import { generateJsonWithFallback } from "./fallback";

const SYSTEM_PROMPT = `You are a Senior Frontend Engineer building a modular React + Vite application.
You must use Tailwind CSS (v4) for styling, lucide-react (v0.344.0) for icons, and framer-motion for animations if needed.

Input Context:
- Brand configuration (colors, typography)
- Product analysis (tone, features, audience)
- Page layout (list of sections to include)

RIGID COMPONENT LIBRARY:
You MUST build the application by creating modular component files.
1. Navbar: Sticky top, flex container, logo left, links center, CTA right.
2. Hero: Split layout or centered text. Massive heading (text-5xl or larger).
3. FeaturesGrid: Grid layout. Cards with icon, title, description.
4. Pricing: Grid of cards. Highlight the middle 'Pro' tier.
5. Footer: Simple 4-column layout with dark background.

Instructions:
1. Generate a complete React project structure.
2. Output modular components in \`/src/components/\` (e.g. \`/src/components/Navbar.tsx\`).
3. Output the main application in \`/App.tsx\` (CRITICAL: must be at the root, not /src/App.tsx) which imports and composes these components.
4. If you create separate page files (e.g. in \`/src/pages/\`), you MUST append "Page" to their function names (e.g. \`export default function PricingPage()\`) to avoid naming collisions with components like \`Pricing.tsx\`.
5. DO NOT use Next.js specific components like \`next/link\`. Use standard HTML \`<a>\` tags.
6. Use Tailwind inline classes to apply the brand colors (e.g. \`text-[{primaryColor}]\`).
7. DO NOT import any CSS files (e.g. \`import './App.css'\` or \`import './index.css'\`). Tailwind is injected globally.
8. Ensure \`/App.tsx\` has a \`export default function App\` declaration.
9. CRITICAL: DO NOT BE LAZY. You must generate the FULL, production-ready code for every single component requested. DO NOT use placeholders like \`{/* Hero Section */}\` or \`// Add content here\`. Write the actual, beautiful UI code with text, buttons, grid layouts, and styling.
10. CRITICAL: For icons from 'lucide-react', use only standard PascalCase names (e.g., Settings, BarChart2, Lock, Server, Menu, Shield, Star, Check, Users, ArrowRight, Activity, Github, Linkedin, X, Download, ExternalLink, Code, Globe, Database, Smartphone, Cloud, Cpu, GitBranch, Layers, Quote, Mail, Heart, MapPin, Calendar, Coffee). DO NOT prefix them with Fi, Hi, Ai, Fa, Bi, Io, Tb, etc. DO NOT use deprecated/renamed icons: 'Twitter' is now 'X', never use 'Twitter'.

Return ONLY valid JSON representing the file system. Do NOT wrap it in markdown.
Format:
{
  "files": {
    "/App.tsx": "import React from 'react';\\nimport Navbar from './src/components/Navbar';\\n\\nexport default function App() { ... }",
    "/src/components/Navbar.tsx": "...",
    "/src/components/Hero.tsx": "..."
  }
}
`;

import { LayoutPlan } from "./planner";

export async function composeReactPage(
  layoutPlan: LayoutPlan,
  analysis: AnalysisResult,
  brand: BrandConfig
): Promise<Record<string, string>> {
  const prompt = `
Generate a modular React codebase for this website.

Pages and Components to create:
${JSON.stringify(layoutPlan.pages, null, 2)}

Product Context:
${JSON.stringify(analysis, null, 2)}

Brand Context:
${JSON.stringify(brand, null, 2)}
  `;

  const result = await generateJsonWithFallback(SYSTEM_PROMPT, prompt, 0.7);
  return result.files || {};
}
