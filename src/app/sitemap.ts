import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";
import { getAllToolSlugs } from "@/lib/tools";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Add all tool pages (derived from the single registry)
  for (const slug of getAllToolSlugs()) {
    entries.push({
      url: `${BASE_URL}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Add blog posts
  try {
    const blogDir = path.join(process.cwd(), "src/content/blog");
    const files = readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      entries.push({
        url: `${BASE_URL}/blog/${file.replace(".mdx", "")}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Blog dir may not exist yet
  }

  return entries;
}
