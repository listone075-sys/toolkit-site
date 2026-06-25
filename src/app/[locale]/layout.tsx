import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Analytics } from "@/components/layout/analytics";
import { AdSense } from "@/components/layout/adsense";
import { PwaRegister } from "@/components/layout/pwa-register";
import { SiteSchema } from "@/components/seo/site-schema";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const base = host ? `${protocol}://${host}` : SITE_URL;

  return {
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
    metadataBase: new URL(base),
    alternates: { canonical: "/" },
    openGraph: {
      url: "/",
      type: "website",
      siteName: "ToolCraft",
      title: "ToolCraft — Free Online Tools",
      description:
        "Free online tools for images, PDFs, Markdown, and developers. All browser-based, no file uploads.",
      images: [{ url: `${base}/og-default.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ToolCraft — Free Online Tools",
      description:
        "Free online tools for images, PDFs, Markdown, and developers. All browser-based, no file uploads.",
      images: [`${base}/og-default.svg`],
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  // Enable static rendering for next-intl
  setRequestLocale(locale);

  const messages = await getMessages();

  // hreflang base: use request host for subdomain support (image.toolcraftbox.com etc.)
  const host = (await headers()).get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const hreflangBase = host ? `${protocol}://${host}` : SITE_URL;

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* hreflang tags for SEO */}
        <link rel="alternate" hrefLang="en" href={`${hreflangBase}/en`} />
        <link rel="alternate" hrefLang="zh" href={`${hreflangBase}/zh`} />
        <link rel="alternate" hrefLang="x-default" href={`${hreflangBase}/en`} />
        {/* PWA */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ToolCraft" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        {/* Site verification */}
        <meta name="google-site-verification" content="b9LnPakW02bBFDppFZysgx3q6V89qDkmD2SkSohVj8Y" />
        <meta name="msvalidate.01" content="00065E437FE00E67C1EB622A839A5166" />
        <meta name="google-site-verification" content="mx7ab6UFuWD0OuKTdl7ai0kqoMJ1Dad7kIL7FivkrX8" />
        {/* AdSense account verification */}
        <meta name="google-adsense-account" content="ca-pub-5142105226310650" />
        {/* Geo-targeting signals (supplementary to hreflang) */}
        <meta name="geo.region" content={locale === "zh" ? "CN" : "US"} />
        <meta name="geo.placename" content="Global" />
        {/* Dublin Core metadata */}
        <meta name="dc.language" content={locale} />
        <meta name="dc.title" content="ToolCraft — Free Online Tools" />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <SiteSchema />
          <Analytics />
          <AdSense />
          <PwaRegister />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
