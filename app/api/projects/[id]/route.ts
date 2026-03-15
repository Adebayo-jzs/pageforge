import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pageforge");
    
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(id),
    });

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
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pageforge");
    
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $set: { html: body.html, provider: body.provider, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
