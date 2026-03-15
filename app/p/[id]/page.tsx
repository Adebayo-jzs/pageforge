import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";

interface PageProps {
  params: { id: string };
}

export default async function SavedPage({ params }: PageProps) {
  // Wait for params in Next.js 15
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id || id.length !== 24) {
    return notFound();
  }

  try {
    const client = await clientPromise;
    const db = client.db("pageforge");
    
    // Find the page in MongoDB
    const page = await db.collection("projects").findOne({
      _id: new ObjectId(id),
    });

    if (!page) {
      return notFound();
    }

    // Render the raw HTML safely
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: page.html }} 
        className="w-full h-full min-h-screen"
      />
    );
  } catch (error) {
    console.error("Failed to load page:", error);
    return notFound();
  }
}
