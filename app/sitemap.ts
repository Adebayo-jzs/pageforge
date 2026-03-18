import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://pageforge.ai";

  // Static routes
  const staticRoutes = [
    '',
    '/login',
    '/register',
    '/policy',
    '/how-it-works',
    '/pricing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic project routes
  let projectRoutes: any[] = [];
  try {
    await dbConnect();
    const projects = await Project.find({}, '_id updatedAt').lean();
    
    projectRoutes = projects.map((project: any) => ({
      url: `${baseUrl}/p/${project._id}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to fetch projects for sitemap:", error);
  }

  return [...staticRoutes, ...projectRoutes];
}
