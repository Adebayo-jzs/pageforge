import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Celerify's own hostname(s).
 * Requests from any OTHER host are treated as custom-domain traffic.
 */
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "celerify.vercel.app";
const VERCEL_URL = process.env.VERCEL_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

/** Normalise a host header: strip port and lowercase */
function stripPort(host: string): string {
  return host.split(":")[0].toLowerCase();
}

/**
 * Returns true when the incoming hostname belongs to Celerify itself
 * (localhost in dev, APP_DOMAIN in prod, or any sub-path preview).
 */
function isAppDomain(host: string): boolean {
  const h = stripPort(host);
  const appHosts = [APP_DOMAIN, VERCEL_URL, NEXTAUTH_URL]
    .filter(Boolean)
    .map((value) => stripPort(value!.replace(/^https?:\/\//, "").replace(/\/.*$/, "")));

  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".vercel.app") ||
    appHosts.some((appHost) => h === appHost || h.endsWith(`.${appHost}`))
  );
}

export default auth((req) => {
  const host = req.headers.get("host") ?? "";

  // ── Custom domain request ──────────────────────────────────────────
  if (!isAppDomain(host)) {
    const { pathname } = req.nextUrl;

    // Prevent infinite rewrite loop and don't rewrite API routes or Next.js static assets
    if (
      pathname.startsWith("/domain") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return NextResponse.next();
    }

    const customDomain = stripPort(host);

    // Rewrite to our internal /domain route, preserving path + query
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/domain${pathname === "/" ? "/__root" : pathname}`;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-custom-domain", customDomain);

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
});

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
