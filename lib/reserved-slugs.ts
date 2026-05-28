/**
 * Slugs that are reserved for PageForge's own routes.
 * A user-chosen deployment slug must never match any of these.
 * Keep this list in sync with the actual folders inside /app.
 */
export const RESERVED_SLUGS = new Set([
  // Static app routes (folder names in /app)
  "api",
  "dashboard",
  "how-it-works",
  "login",
  "new",
  "p",
  "policy",
  "pricing",
  "project",
  "register",
  "domain",
  // Generated file routes
  "robots.txt",
  "sitemap.xml",
  // Common sensitive/misleading paths
  "admin",
  "app",
  "auth",
  "health",
  "me",
  "null",
  "undefined",
  "static",
  "www",
  "_next",
  "favicon.ico",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
}
