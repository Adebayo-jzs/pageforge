import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Celerify",
  description: "Simple, transparent pricing for Celerify. Start for free and scale as your product grows.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
