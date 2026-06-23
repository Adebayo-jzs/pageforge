import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it Works | Celerify",
  description: "Learn how Celerify uses AI to turn your product descriptions into production-ready landing pages in 4 simple steps.",
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
