import type { Metadata } from "next";
import type { ToolConfig } from "@/lib/tools/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

/**
 * Generate page metadata for a tool page
 */
export function generateToolMetadata(tool: ToolConfig): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`;
  return {
    title: `${tool.title} — Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      type: "website",
      siteName: "ToolKit",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
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
