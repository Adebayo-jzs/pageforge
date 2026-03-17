import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

interface PageProps {
  params: Promise<{ id: string; slug: string[] }>;
}

export default async function SubPage({ params }: PageProps) {
  const { id, slug } = await params;

  if (!id || id.length !== 24) {
    return notFound();
  }

  const path = "/" + slug.join("/");

  try {
    await dbConnect();
    const project = await Project.findById(id);

    if (!project || !project.pages || project.pages.length === 0) {
      return notFound();
    }

    // Try finding exact match or one without leading slash if necessary
    const page = project.pages.find((p: any) => p.path === path || p.path === slug.join("/") || "/" + p.path === path);

    if (!page || !page.html) {
      return notFound();
    }
    
    // Inject relative base tag
    let htmlToRender = page.html;
    htmlToRender = htmlToRender.replace(/<head>/i, `<head><base href="/p/${id}/" />`);

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlToRender }} 
        className="w-full h-full min-h-screen"
      />
    );
  } catch (error) {
    console.error("Failed to load subpage:", error);
    return notFound();
  }
}
