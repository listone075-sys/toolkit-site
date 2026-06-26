import type { Metadata } from "next";
import type { ToolConfig } from "@/lib/tools/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

/**
 * Generate page metadata for a tool page (locale-aware).
 * Uses SITE_URL for canonical, hreflang, and OG image URLs.
 */
export function generateToolMetadata(tool: ToolConfig, locale = "en"): Metadata {
  const url = `${SITE_URL}/${locale}/tools/${tool.slug}`;
  return {
    title: `${tool.title} — Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/tools/${tool.slug}`,
        zh: `${SITE_URL}/zh/tools/${tool.slug}`,
      },
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      type: "website",
      siteName: "ToolCraft",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: [`${SITE_URL}/og-default.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
