import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * PageForge's own hostname(s).
 * Requests from any OTHER host are treated as custom-domain traffic.
 */
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "celerify.vercel.app";

/** Normalise a host header: strip port and lowercase */
function stripPort(host: string): string {
  return host.split(":")[0].toLowerCase();
}

/**
 * Returns true when the incoming hostname belongs to PageForge itself
 * (localhost in dev, APP_DOMAIN in prod, or any sub-path preview).
 */
function isAppDomain(host: string): boolean {
  const h = stripPort(host);
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === stripPort(APP_DOMAIN) ||
    h.endsWith(`.${stripPort(APP_DOMAIN)}`)
  );
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  // ── Custom domain request ──────────────────────────────────────────
  if (!isAppDomain(host)) {
    const customDomain = stripPort(host);
    const { pathname, search } = req.nextUrl;

    // Rewrite to our internal /domain route, preserving path + query
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/domain${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.rewrite(rewriteUrl);
    // Pass the custom domain down to the page via header
    response.headers.set("x-custom-domain", customDomain);
    return response;
  }

  // ── Normal PageForge request → run NextAuth middleware ─────────────
  return (auth as any)(req);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - Next.js internals (_next/static, _next/image)
     * - Static assets (favicon, og image)
     * - Sitemap / robots
     * Custom domain requests arrive on ALL paths so we must NOT exclude them.
     */
    "/((?!_next/static|_next/image|favicon.ico|og-image.png|sitemap.xml|robots.txt).*)",
  ],
};