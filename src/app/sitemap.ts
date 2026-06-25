import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";
import { getToolRegistry } from "@/lib/tools";
import { routing } from "@/i18n/routing";
import type { ToolCategory } from "@/lib/tools/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

/** Category → subdomain mapping */
const CATEGORY_SUBDOMAINS: Record<ToolCategory, string> = {
  image: `https://image.toolcraftbox.com`,
  pdf: `https://pdf.toolcraftbox.com`,
  markdown: `https://markdown.toolcraftbox.com`,
  dev: `https://dev.toolcraftbox.com`,
  calculator: BASE_URL,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const tools = getToolRegistry("en"); // slugs/categories are locale-agnostic

  // Entry per locale for all pages
  for (const locale of routing.locales) {
    // Homepage (main domain only)
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    // Blog listing (main domain only)
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Tool pages — use category subdomain
    for (const tool of tools) {
      const subdomain = CATEGORY_SUBDOMAINS[tool.category] ?? BASE_URL;
      entries.push({
        url: `${subdomain}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }

    // Privacy & Terms (main domain only)
    entries.push({
      url: `${BASE_URL}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    });
    entries.push({
      url: `${BASE_URL}/${locale}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  // Blog posts (only for locales that have them — main domain only)
  for (const locale of routing.locales) {
    try {
      const blogDir = path.join(process.cwd(), "src/content/blog", locale);
      const files = readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
      for (const file of files) {
        entries.push({
          url: `${BASE_URL}/${locale}/blog/${file.replace(".mdx", "")}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    } catch {
      // Locale directory doesn't exist yet
    }
  }

  return entries;
}
