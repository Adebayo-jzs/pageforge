import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";

interface ProjectUpdateData {
  provider?: string;
  html?: string;
  pages?: unknown;
  title?: string;
  slug?: string | null;
  customDomain?: string | null;
  domainVerified?: boolean;
  deploymentStatus?: "live" | "paused" | "draft";
  lastDeployedAt?: string;
}

function normalizeCustomDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await dbConnect();
    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to load project:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await dbConnect();

    const existingProject = await Project.findOne({ _id: id, userId });
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    // Validate slug uniqueness if provided
    if (body.slug !== undefined && body.slug !== null && body.slug !== "") {
      const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
      if (!slugRegex.test(body.slug)) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }
      if (body.slug.length < 3 || body.slug.length > 48) {
        return NextResponse.json(
          { error: "Slug must be between 3 and 48 characters" },
          { status: 400 }
        );
      }
      if (isReservedSlug(body.slug)) {
        return NextResponse.json(
          { error: `"${body.slug}" is a reserved name and cannot be used as a deployment slug.` },
          { status: 409 }
        );
      }
      const existing = await Project.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json(
          { error: "This slug is already taken. Please choose another." },
          { status: 409 }
        );
      }
    }

    let normalizedCustomDomain: string | null | undefined;
    if (body.customDomain !== undefined) {
      normalizedCustomDomain = body.customDomain
        ? normalizeCustomDomain(body.customDomain)
        : null;

      if (normalizedCustomDomain) {
        const domainRegex =
          /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
        if (!domainRegex.test(normalizedCustomDomain)) {
          return NextResponse.json(
            { error: "Please enter a valid domain or subdomain." },
            { status: 400 }
          );
        }

        const existingDomain = await Project.findOne({
          customDomain: normalizedCustomDomain,
          _id: { $ne: id },
        });
        if (existingDomain) {
          return NextResponse.json(
            { error: "This domain is already connected to another project." },
            { status: 409 }
          );
        }
      }

      // Sync domain with Vercel API if it has changed
      if (existingProject.customDomain !== normalizedCustomDomain) {
        if (existingProject.customDomain) {
          await removeDomainFromVercel(existingProject.customDomain);
        }
        if (normalizedCustomDomain) {
          const vercelRes = await addDomainToVercel(normalizedCustomDomain);
          if (!vercelRes.success) {
            return NextResponse.json(
              { error: `Failed to connect domain: ${vercelRes.error}` },
              { status: 400 }
            );
          }
        }
      }
    }

    const updateData: ProjectUpdateData = {};
    if (body.provider !== undefined) updateData.provider = body.provider;
    if (body.html !== undefined) updateData.html = body.html;
    if (body.pages !== undefined) updateData.pages = body.pages;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug || null;
    if (body.customDomain !== undefined) updateData.customDomain = normalizedCustomDomain;
    if (body.domainVerified !== undefined) updateData.domainVerified = body.domainVerified;
    if (body.deploymentStatus !== undefined) updateData.deploymentStatus = body.deploymentStatus;
    if (body.lastDeployedAt !== undefined) updateData.lastDeployedAt = body.lastDeployedAt;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await dbConnect();
    const project = await Project.findOneAndDelete({ _id: id, userId });

    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    if (project.customDomain) {
      await removeDomainFromVercel(project.customDomain);
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
