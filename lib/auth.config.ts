import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

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
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/login") || 
                         nextUrl.pathname.startsWith("/register");
      const isPublicPage = nextUrl.pathname === "/" || 
                           nextUrl.pathname.startsWith("/policy") || 
                           nextUrl.pathname.startsWith("/how-it-works") || 
                           nextUrl.pathname.startsWith("/pricing") ||
                           nextUrl.pathname.startsWith("/og-image.png") ||
                           nextUrl.pathname.startsWith("/sitemap.xml") ||
                           nextUrl.pathname.startsWith("/robots.txt") ||
                           nextUrl.pathname.startsWith("/p/");

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      return isLoggedIn || isPublicPage;
    },
  },
} satisfies NextAuthConfig;
