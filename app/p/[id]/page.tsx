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

    let htmlToRender = project.html;

    if (project.pages && project.pages.length > 0) {
      const homePage = project.pages.find((p: any) => p.path === "/" || p.path === "index.html") || project.pages[0];
      if (homePage && homePage.html) {
        htmlToRender = homePage.html;
        htmlToRender = htmlToRender.replace(/<head>/i, `<head><base href="/p/${id}/" />`);
      }
    }

    if (!htmlToRender) {
      return notFound();
    }

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlToRender }} 
        className="w-full h-full min-h-screen"
      />
    );
  } catch (error) {
    console.error("Failed to load page:", error);
    return notFound();
  }
}
