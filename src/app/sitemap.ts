import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";
import { getAllToolSlugs } from "@/lib/tools";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const toolSlugs = getAllToolSlugs();

  // Entry per locale for all pages
  for (const locale of routing.locales) {
    // Homepage
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    // Blog listing
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Tool pages — all on main domain
    for (const slug of toolSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/tools/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }

    // Privacy & Terms
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

  // Blog posts (only for locales that have them)
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
