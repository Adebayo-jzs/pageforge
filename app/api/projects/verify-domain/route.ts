import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";

const resolveCname = promisify(dns.resolveCname);
const resolve4 = promisify(dns.resolve4);

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "celerify.vercel.app";
const VERCEL_CNAME_TARGET = process.env.VERCEL_CNAME_TARGET ?? "cname.vercel-dns.com";
const VERCEL_A_RECORD = process.env.VERCEL_A_RECORD ?? "76.76.21.21";

function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

function normalizeDnsValue(value: string): string {
  return value.toLowerCase().replace(/\.$/, "");
}

function getExpectedCnameTargets() {
  return Array.from(new Set([APP_DOMAIN, VERCEL_CNAME_TARGET].map(normalizeDnsValue)));
}

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

    const domain = normalizeDomain(project.customDomain ?? "");
    if (!domain) {
      return NextResponse.json(
        { error: "No custom domain set on this project" },
        { status: 400 }
      );
    }

    let verified = false;
    let foundRecord = "";

    try {
      const cnames = await resolveCname(domain);
      const expectedTargets = getExpectedCnameTargets();
      const match = cnames.find((cname) => {
        const value = normalizeDnsValue(cname);
        return expectedTargets.some(
          (target) => value === target || value.endsWith(`.${target}`)
        );
      });

      if (match) {
        verified = true;
        foundRecord = `CNAME -> ${match}`;
      } else {
        foundRecord = `CNAME found but points to: ${cnames.join(", ")}`;
      }
    } catch {
      // Apex domains commonly use A records instead of CNAME records.
    }

    if (!verified) {
      try {
        const [appIPs, domainIPs] = await Promise.all([
          resolve4(APP_DOMAIN),
          resolve4(domain),
        ]);
        const appSet = new Set([...appIPs, VERCEL_A_RECORD]);
        const overlap = domainIPs.filter((ip) => appSet.has(ip));

        if (overlap.length > 0) {
          verified = true;
          foundRecord = `A record -> ${overlap[0]}`;
        } else {
          foundRecord = foundRecord || "A records found but do not match this deployment";
        }
      } catch {
        // DNS lookup failed or no compatible A record exists yet.
      }
    }

    if (!verified) {
      return NextResponse.json(
        {
          verified: false,
          error: foundRecord || `No DNS record found pointing to ${APP_DOMAIN}`,
          hint: domain.startsWith("www.")
            ? `Add a CNAME record: www -> ${VERCEL_CNAME_TARGET}`
            : `Add an A record: @ -> ${VERCEL_A_RECORD}, or use a subdomain CNAME to ${VERCEL_CNAME_TARGET}`,
        },
        { status: 200 }
      );
    }

    await Project.findByIdAndUpdate(projectId, {
      customDomain: domain,
      domainVerified: true,
    });

    return NextResponse.json({ verified: true, record: foundRecord });
  } catch (error) {
    console.error("verify-domain error:", error);
    return NextResponse.json(
      { error: "Server error during verification" },
      { status: 500 }
    );
  }
}
