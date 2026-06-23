import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { isReservedSlug } from "@/lib/reserved-slugs";

/**
 * GET /api/projects/check-slug?slug=xxx&projectId=yyy
 *
 * Returns:
 *   { available: true }
 *   { available: false, reason: "empty" | "invalid" | "too_short" | "too_long" | "reserved" | "taken" }
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = (searchParams.get("slug") ?? "").toLowerCase().trim();
    const projectId = searchParams.get("projectId") ?? "";

    // --- Basic validation ---
    if (!slug) {
      return NextResponse.json({ available: false, reason: "empty" });
    }

    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ available: false, reason: "invalid" });
    }

    if (slug.length < 3) {
      return NextResponse.json({ available: false, reason: "too_short" });
    }

    if (slug.length > 48) {
      return NextResponse.json({ available: false, reason: "too_long" });
    }

    // --- Reserved check ---
    if (isReservedSlug(slug)) {
      return NextResponse.json({ available: false, reason: "reserved" });
    }

    // --- Database uniqueness check (exclude current project) ---
    await dbConnect();
    const query: any = { slug };
    if (projectId && projectId.length === 24) {
      query._id = { $ne: projectId };
    }
    const existing = await Project.findOne(query).select("_id").lean();

    if (existing) {
      return NextResponse.json({ available: false, reason: "taken" });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("check-slug error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
