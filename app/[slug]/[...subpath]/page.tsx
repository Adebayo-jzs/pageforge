import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

interface PageProps {
  params: Promise<{ slug: string; subpath: string[] }>;
}

const reservedSlugs = [
  "api", "dashboard", "how-it-works", "login", "new", "p", "policy", "pricing", "project", "register"
];

export default async function DeployedSubPage({ params }: PageProps) {
  const { slug, subpath } = await params;

  if (reservedSlugs.includes(slug)) {
    return notFound();
  }

  const path = "/" + subpath.join("/");

  try {
    await dbConnect();
    const project = await Project.findOne({ slug: slug.toLowerCase() }).lean();

    if (!project || !project.pages || project.pages.length === 0) {
      return notFound();
    }

    // Check status
    if (project.deploymentStatus !== "live") {
      return notFound();
    }

    // Try finding exact match or one without leading slash if necessary
    const page = project.pages.find(
      (p: any) => p.path === path || p.path === subpath.join("/") || "/" + p.path === path
    );

    if (!page || !page.html) {
      return notFound();
    }
    
    // Inject relative base tag pointing to root slug path
    let htmlToRender = page.html;
    htmlToRender = htmlToRender.replace(/<head>/i, `<head><base href="/${slug}/" />`);

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlToRender }} 
        className="w-full h-full min-h-screen"
      />
    );
  } catch (error) {
    console.error("Failed to load deployed subpage:", error);
    return notFound();
  }
}
