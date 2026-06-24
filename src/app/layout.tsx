import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com"),
  robots: { index: true, follow: true },
};

/**
 * Root layout — minimal pass-through.
 * The actual <html>, <body>, fonts and providers live in [locale]/layout.tsx
 * so that `lang` can be set dynamically per locale.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
