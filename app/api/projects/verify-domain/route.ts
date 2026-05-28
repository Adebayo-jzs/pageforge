import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";

const resolveCname = promisify(dns.resolveCname);
const resolve4 = promisify(dns.resolve4);

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "celerify.vercel.app";

/**
 * POST /api/projects/verify-domain
 * Body: { projectId: string }
 *
 * Checks if the project's customDomain has a valid CNAME → APP_DOMAIN.
 * On success, marks domainVerified: true in the DB.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ error: "projectId required" }, { status: 400 });
    }

    await dbConnect();

    const project = await Project.findOne({
      _id: projectId,
      userId: session.user.id,
    }).select("customDomain domainVerified");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const domain = project.customDomain?.trim();
    if (!domain) {
      return NextResponse.json(
        { error: "No custom domain set on this project" },
        { status: 400 }
      );
    }

    // ── Step 1: Try CNAME lookup ──────────────────────────────────────
    let verified = false;
    let foundRecord = "";

    try {
      const cnames = await resolveCname(domain);
      // A CNAME chain can have multiple hops — check if any ends with APP_DOMAIN
      const match = cnames.find(
        (c) =>
          c === APP_DOMAIN ||
          c === `${APP_DOMAIN}.` ||
          c.endsWith(`.${APP_DOMAIN}`)
      );
      if (match) {
        verified = true;
        foundRecord = `CNAME → ${match}`;
      } else {
        foundRecord = `CNAME found but points to: ${cnames.join(", ")}`;
      }
    } catch {
      // No CNAME record — fall through to A-record check
    }

    // ── Step 2: Fallback — resolve our APP_DOMAIN's IP and compare ────
    if (!verified) {
      try {
        const [appIPs, domainIPs] = await Promise.all([
          resolve4(APP_DOMAIN),
          resolve4(domain),
        ]);
        const appSet = new Set(appIPs);
        const overlap = domainIPs.filter((ip) => appSet.has(ip));
        if (overlap.length > 0) {
          verified = true;
          foundRecord = `A record → ${overlap[0]}`;
        } else {
          foundRecord = foundRecord || `A records found but don't match PageForge IPs`;
        }
      } catch {
        // DNS lookup completely failed
      }
    }

    if (!verified) {
      return NextResponse.json(
        {
          verified: false,
          error: foundRecord || "No DNS record found pointing to celerify.vercel.app",
          hint: `Add a CNAME record: ${domain.startsWith("www.") ? "www" : "@"} → ${APP_DOMAIN}`,
        },
        { status: 200 }
      );
    }

    // ── Mark verified in DB ───────────────────────────────────────────
    await Project.findByIdAndUpdate(projectId, { domainVerified: true });

    return NextResponse.json({ verified: true, record: foundRecord });
  } catch (error) {
    console.error("verify-domain error:", error);
    return NextResponse.json({ error: "Server error during verification" }, { status: 500 });
  }
}
