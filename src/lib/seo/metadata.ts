import type { Metadata } from "next";
import type { ToolConfig } from "@/lib/tools/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

/**
 * Build the base URL from a Host header, falling back to SITE_URL.
 * Supports subdomain detection (image.toolcraftbox.com etc.).
 */
function getBaseUrl(host?: string): string {
  if (!host) return SITE_URL;
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

/**
 * Generate page metadata for a tool page (locale-aware, subdomain-aware)
 */
export function generateToolMetadata(tool: ToolConfig, locale = "en", host?: string): Metadata {
  const base = getBaseUrl(host);
  const url = `${base}/${locale}/tools/${tool.slug}`;
  return {
    title: `${tool.title} — Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/en/tools/${tool.slug}`,
        zh: `${base}/zh/tools/${tool.slug}`,
      },
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      type: "website",
      siteName: "ToolCraft",
      images: [{ url: `${base}/og-default.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: [`${base}/og-default.svg`],
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
