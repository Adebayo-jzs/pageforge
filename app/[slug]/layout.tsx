export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render children directly — no nav, no Celerify chrome.
  // The page manages its own full-screen layout.
  return <>{children}</>;
}
