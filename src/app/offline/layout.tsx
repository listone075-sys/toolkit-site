import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You are offline — ToolCraft",
  description:
    "ToolCraft tools you've visited before should still work offline.",
  robots: { index: false, follow: false },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout: no header, footer, or JS bundles.
  // The page is pre-cached by the service worker and must work offline.
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
