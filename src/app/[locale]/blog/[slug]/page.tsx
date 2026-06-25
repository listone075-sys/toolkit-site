import { readFileSync, readdirSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const entries: { locale: string; slug: string }[] = [];
  const blogRoot = path.join(process.cwd(), "src/content/blog");

  // Collect slugs per locale directory
  for (const locale of ["en", "zh"]) {
    try {
      const dir = path.join(blogRoot, locale);
      const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
      for (const f of files) {
        entries.push({ locale, slug: f.replace(".mdx", "") });
      }
    } catch {
      // Directory doesn't exist yet
    }
  }

  return entries;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  // Use request host for subdomain-aware canonical/hreflang
  const { headers } = await import("next/headers");
  const hostHeader = (await headers()).get("host") ?? "";
  const protocol = hostHeader.startsWith("localhost") ? "http" : "https";
  const base = hostHeader ? `${protocol}://${hostHeader}` : SITE_URL;

  // Try locale-specific file first, fall back to en
  let filePath = path.join(process.cwd(), "src/content/blog", locale, `${slug}.mdx`);
  try {
    readFileSync(filePath);
  } catch {
    filePath = path.join(process.cwd(), "src/content/blog", "en", `${slug}.mdx`);
  }
  try {
    const raw = readFileSync(filePath, "utf-8");
    const match = raw.match(/export const meta = ({[\s\S]*?});/);
    if (match) {
      const meta = eval(`(${match[1]})`);
      const url = `${base}/${locale}/blog/${slug}`;
      return {
        title: meta.title,
        description: meta.description,
        alternates: {
          canonical: url,
          languages: {
            en: `${base}/en/blog/${slug}`,
            zh: `${base}/zh/blog/${slug}`,
          },
        },
        openGraph: {
          title: meta.title,
          description: meta.description,
          url,
          type: "article",
          siteName: "ToolCraft",
          images: [{ url: `${base}/og-default.svg`, width: 1200, height: 630 }],
        },
        twitter: {
          card: "summary_large_image",
          title: meta.title,
          description: meta.description,
          images: [`${base}/og-default.svg`],
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch { /* not found */ }
  return { title: "Blog Post | ToolCraft" };
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Try locale-specific file first, fall back to en
  let importPath = `@/content/blog/${locale}/${slug}.mdx`;
  let filePath = path.join(process.cwd(), "src/content/blog", locale, `${slug}.mdx`);

  try {
    readFileSync(filePath);
  } catch {
    // Fall back to English
    importPath = `@/content/blog/en/${slug}.mdx`;
    filePath = path.join(process.cwd(), "src/content/blog", "en", `${slug}.mdx`);
    try {
      readFileSync(filePath);
    } catch {
      notFound();
    }
  }

  const { default: Post } = await import(importPath);
  const { AdUnit } = await import("@/components/layout/ad-unit");

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Post />
      <div className="mt-12 flex justify-center">
        <AdUnit format="horizontal" />
      </div>
    </article>
  );
}
