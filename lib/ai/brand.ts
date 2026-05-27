import { generateJsonWithFallback } from "./fallback";

export interface BrandConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  borderRadius: string;
}

const SYSTEM_PROMPT = `You are a world-class art director. Based on the product analysis, generate a design system.
Return ONLY valid JSON. All colors must be hex codes or valid CSS colors.
Choose from these modern Google Fonts: "Inter", "Outfit", "Plus Jakarta Sans", "Bricolage Grotesque", "Syne", "Space Grotesk".

Format:
{
  "primaryColor": "#HEX",
  "accentColor": "#HEX",
  "backgroundColor": "#HEX (e.g. #09090b for dark, #ffffff for light)",
  "textColor": "#HEX",
  "fontFamilyHeading": "Font Name",
  "fontFamilyBody": "Font Name",
  "borderRadius": "e.g. 0px, 0.5rem, 1rem, 9999px"
}`;

export async function generateBrand(analysis: any): Promise<BrandConfig> {
  return generateJsonWithFallback(SYSTEM_PROMPT, JSON.stringify(analysis), 0.7);
}
