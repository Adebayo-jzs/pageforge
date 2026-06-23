import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "celerify.vercel.app";
const VERCEL_URL = process.env.VERCEL_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

function stripPort(host: string): string {
  return host.split(":")[0].toLowerCase();
}

function isAppDomain(host: string): boolean {
  const hostname = stripPort(host);
  const appHosts = [APP_DOMAIN, VERCEL_URL, NEXTAUTH_URL]
    .filter(Boolean)
    .map((value) => stripPort(value!.replace(/^https?:\/\//, "").replace(/\/.*$/, "")));

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app") ||
    appHosts.some((appHost) => hostname === appHost || hostname.endsWith(`.${appHost}`))
  );
}

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const host = request.headers.get("host") ?? "";

      if (host && !isAppDomain(host)) {
        return true;
      }

      const isAuthPage = nextUrl.pathname.startsWith("/login") || 
                         nextUrl.pathname.startsWith("/register");
      const isPublicPage = nextUrl.pathname === "/" || 
                           nextUrl.pathname.startsWith("/policy") || 
                           nextUrl.pathname.startsWith("/how-it-works") || 
                           nextUrl.pathname.startsWith("/pricing") ||
                           nextUrl.pathname.startsWith("/og-image.png") ||
                           nextUrl.pathname.startsWith("/sitemap.xml") ||
                           nextUrl.pathname.startsWith("/robots.txt") ||
                           nextUrl.pathname.startsWith("/p/") ||
                           nextUrl.pathname.startsWith("/domain/") ||
                           /^\/[^/]+$/.test(nextUrl.pathname);

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      return isLoggedIn || isPublicPage;
    },
  },
} satisfies NextAuthConfig;
