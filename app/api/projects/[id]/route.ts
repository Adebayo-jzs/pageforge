import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { isReservedSlug } from "@/lib/reserved-slugs";

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

    const updateData: any = {};
    if (body.provider !== undefined) updateData.provider = body.provider;
    if (body.html !== undefined) updateData.html = body.html;
    if (body.pages !== undefined) updateData.pages = body.pages;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug || null;
    if (body.customDomain !== undefined) updateData.customDomain = body.customDomain || null;
    if (body.domainVerified !== undefined) updateData.domainVerified = body.domainVerified;
    if (body.deploymentStatus !== undefined) updateData.deploymentStatus = body.deploymentStatus;
    if (body.lastDeployedAt !== undefined) updateData.lastDeployedAt = body.lastDeployedAt;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

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

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
