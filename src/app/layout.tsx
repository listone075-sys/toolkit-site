import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Analytics } from "@/components/layout/analytics";
import { SiteSchema } from "@/components/seo/site-schema";
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
    default: "ToolCraft — Free Online Tools",
    template: "%s | ToolCraft",
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolkit.futuretime.site"), alternates: { canonical: "/" }, openGraph: { url: "/",
    type: "website",
    siteName: "ToolCraft",
    title: "ToolCraft — Free Online Tools",
    description:
      "Free online tools for images, PDFs, Markdown, and developers. All browser-based, no file uploads.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta name="google-site-verification" content="b9LnPakW02bBFDppFZysgx3q6V89qDkmD2SkSohVj8Y" />
        <meta name="msvalidate.01" content="00065E437FE00E67C1EB622A839A5166" />
        <meta name="google-site-verification" content="mx7ab6UFuWD0OuKTdl7ai0kqoMJ1Dad7kIL7FivkrX8" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5142105226310650" crossOrigin="anonymous" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0EHKDP008P" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0EHKDP008P',{anonymize_ip:true});`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteSchema />
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
