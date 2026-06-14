import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ToolKit — Free Online Tools",
    template: "%s | ToolKit",
  },
  description:
    "Free online tools for images, PDFs, Markdown, and developers. All processing happens in your browser — your files are never uploaded.",
  keywords: [
    "online tools",
    "free tools",
    "image converter",
    "pdf converter",
    "markdown editor",
    "json formatter",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "ToolKit",
    title: "ToolKit — Free Online Tools",
    description:
      "Free online tools for images, PDFs, Markdown, and developers. All browser-based, no file uploads.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
