import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Analytics } from "@/components/layout/analytics";
import { AdSense } from "@/components/layout/adsense";
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
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    openGraph: {
      url: "/",
      type: "website",
      siteName: "ToolCraft",
      title: "ToolCraft — Free Online Tools",
      description:
        "Free online tools for images, PDFs, Markdown, and developers. All browser-based, no file uploads.",
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

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* hreflang tags for SEO */}
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="zh" href={`${SITE_URL}/zh`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/en`} />
        {/* Site verification */}
        <meta name="google-site-verification" content="b9LnPakW02bBFDppFZysgx3q6V89qDkmD2SkSohVj8Y" />
        <meta name="msvalidate.01" content="00065E437FE00E67C1EB622A839A5166" />
        <meta name="google-site-verification" content="mx7ab6UFuWD0OuKTdl7ai0kqoMJ1Dad7kIL7FivkrX8" />
        {/* AdSense account verification */}
        <meta name="google-adsense-account" content="ca-pub-5142105226310650" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0EHKDP008P" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0EHKDP008P',{anonymize_ip:true});`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <SiteSchema />
          <Analytics />
          <AdSense />
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
