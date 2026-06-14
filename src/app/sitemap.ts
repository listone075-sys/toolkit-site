import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";

const BASE_URL = "https://toolkit.com";

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

  // Add all tool pages
  const toolSlugs = [
    "heic-to-jpg", "webp-to-jpg", "image-compressor",
    "markdown-editor", "markdown-to-html", "markdown-table-generator",
    "json-formatter", "base64-encode-decode", "uuid-generator",
    "jpg-to-pdf", "pdf-to-jpg", "merge-pdf",
  ];

  for (const slug of toolSlugs) {
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
