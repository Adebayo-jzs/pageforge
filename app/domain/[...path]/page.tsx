import { notFound } from "next/navigation";
import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import ReactPreview from "../../p/[id]/ReactPreview";

interface PageProps {
  params: Promise<{ path: string[] }>;
}

interface ProjectFile {
  path: string;
  content: string;
}

interface ProjectPage {
  path: string;
  html?: string;
}

interface RenderableProject {
  type?: "html" | "react";
  files?: ProjectFile[];
  pages?: ProjectPage[];
  html?: string;
}

/**
 * Serves pages for custom-domain requests.
 * The middleware rewrites e.g. www.mysite.com/about → /_domains/about
 * and sets the x-custom-domain header so we know which domain to look up.
 */
export default async function CustomDomainPage({ params }: PageProps) {
  const headersList = await headers();
  const customDomain = headersList.get("x-custom-domain");

  if (!customDomain) return notFound();

  const { path } = await params;
  const subpath = !path || path[0] === "__root" ? "/" : "/" + path.join("/");

  try {
    await dbConnect();

    const project = await Project.findOne({
      customDomain: customDomain.toLowerCase(),
      deploymentStatus: "live",
    }).lean<RenderableProject | null>();

    if (!project) return notFound();

    // ── React project ──────────────────────────────────────────────────
    if (project.type === "react") {
      const files = project.files || [];
      const filesRecord: Record<string, string> = Array.isArray(files)
        ? files.reduce<Record<string, string>>((acc, file) => {
            acc[file.path] = file.content;
            return acc;
          }, {})
        : {};
      return <ReactPreview files={filesRecord} />;
    }

    // ── Multi-page / HTML project ──────────────────────────────────────
    let htmlToRender = "";

    if (project.pages && project.pages.length > 0) {
      // Match the requested subpath to a page
      const page =
        subpath === "/"
          ? project.pages.find((page) => page.path === "/" || page.path === "index.html") ??
            project.pages[0]
          : project.pages.find(
              (page) =>
                page.path === subpath ||
                page.path === subpath.replace(/^\//, "") ||
                "/" + page.path === subpath
            );

      if (page?.html) {
        // For custom domains, base href is just "/" (they own the root)
        htmlToRender = page.html.replace(/<head>/i, `<head><base href="/" />`);
      }
    } else if (project.html) {
      htmlToRender = project.html;
    }

    if (!htmlToRender) return notFound();

    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlToRender }}
        className="w-full h-full min-h-screen"
      />
    );
  } catch (error) {
    console.error("Custom domain render error:", error);
    return notFound();
  }
}
