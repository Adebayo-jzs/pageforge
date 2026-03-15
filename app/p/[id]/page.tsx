import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SavedPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.length !== 24) {
    return notFound();
  }

  try {
    await dbConnect();
    const project = await Project.findById(id);

    if (!project) {
      return notFound();
    }

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: project.html }} 
        className="w-full h-full min-h-screen"
      />
    );
  } catch (error) {
    console.error("Failed to load page:", error);
    return notFound();
  }
}
