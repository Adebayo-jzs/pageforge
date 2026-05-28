import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  if (!id || id.length !== 24) {
    return { title: "Project Not Found | PageForge" };
  }

  try {
    await dbConnect();
    const project = await Project.findById(id);

    if (!project) {
      return { title: "Project Not Found | PageForge" };
    }

    const title = `PageForge | ${project.prompt.substring(0, 50)}${project.prompt.length > 50 ? "..." : ""}`;
    const description = `Landing page generated for: ${project.prompt}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://pageforge.ai/p/${id}`,
        siteName: "PageForge",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "PageForge AI Landing Page Generator",
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-image.png"],
      },
    };
  } catch (error) {
    return { title: "Error | PageForge" };
  }
}

import ReactPreview from "./ReactPreview";

export default async function SavedPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.length !== 24) {
    return notFound();
  }

  try {
    await dbConnect();
    const project = await Project.findById(id).lean();

    if (!project) {
      return notFound();
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || project.userId !== userId) {
      return notFound();
    }

    if (project.type === "react") {
      const files = project.files || [];
      let filesRecord: Record<string, string> = {};
      if (Array.isArray(files)) {
        filesRecord = files.reduce((acc: any, file: any) => {
          acc[file.path] = file.content;
          return acc;
        }, {});
      }
      return <ReactPreview files={filesRecord} />;
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
