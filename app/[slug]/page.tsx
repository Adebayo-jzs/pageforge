import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import ReactSite from "./ReactSite";
import { isReservedSlug } from "@/lib/reserved-slugs";

interface PageProps {
  params: Promise<{ slug: string }>;
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isReservedSlug(slug)) {
    return {};
  }

  try {
    await dbConnect();
    const project = await Project.findOne({ slug: slug.toLowerCase() });

    if (!project) {
      return { title: "Not Found | Celerify" };
    }

    const title = project.title || `${project.prompt.substring(0, 50)}${project.prompt.length > 50 ? "..." : ""}`;
    const description = `Landing page for ${project.title || project.prompt}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: "Celerify Deployed",
        locale: "en_US",
        type: "website",
      },
    };
  } catch (error) {
    return { title: "Error | Celerify" };
  }
}

export default async function DeployedPage({ params }: PageProps) {
  const { slug } = await params;

  if (isReservedSlug(slug)) {
    return notFound();
  }

  try {
    await dbConnect();
    const project = await Project.findOne({ slug: slug.toLowerCase() }).lean();

    if (!project) {
      return notFound();
    }

    // If draft, it shouldn't be publicly accessible
    if (project.deploymentStatus === "draft") {
      return notFound();
    }

    // Handle Paused deployment state
    if (project.deploymentStatus === "paused") {
      return (
        <div className="min-h-screen bg-[#F5F2ED] text-[#1A1714] font-sans flex flex-col items-center justify-center px-6">
          <div className="max-w-md w-full text-center space-y-6 bg-white border border-[#1A1714]/10 rounded-3xl p-8 md:p-10 shadow-[0_4px_16px_rgba(26,23,20,0.04)]">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-500 animate-pulse">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A1714]">Deployment Paused</h1>
              <p className="text-sm text-[#6B6460] font-light leading-relaxed">
                This project has been temporarily paused by its owner. Please check back later.
              </p>
            </div>

            <div className="h-px bg-[#1A1714]/5" />

            <div className="space-y-3 pt-2">
              <a
                href="/dashboard"
                className="inline-flex w-full justify-center items-center py-3 bg-[#1A1714] text-white font-bold rounded-2xl text-xs hover:bg-[#E8521A] transition-all duration-200"
              >
                Dashboard
              </a>
              <a
                href="/"
                className="inline-block text-xs font-semibold text-[#6B6460] hover:text-[#1A1714] transition-colors"
              >
                Powered by Celerify
              </a>
            </div>
          </div>
        </div>
      );
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
      return <ReactSite files={filesRecord} />;
    }

    let htmlToRender = project.html;

    if (project.pages && project.pages.length > 0) {
      const homePage = project.pages.find((p: any) => p.path === "/" || p.path === "index.html") || project.pages[0];
      if (homePage && homePage.html) {
        htmlToRender = homePage.html;
        // Inject relative base tag pointing to the slug route
        htmlToRender = htmlToRender.replace(/<head>/i, `<head><base href="/${slug}/" />`);
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
    console.error("Failed to load deployed page:", error);
    return notFound();
  }
}
