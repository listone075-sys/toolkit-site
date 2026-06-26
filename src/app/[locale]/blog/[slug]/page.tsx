import { readFileSync, readdirSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

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
      const url = `${SITE_URL}/${locale}/blog/${slug}`;
      return {
        title: meta.title,
        description: meta.description,
        alternates: {
          canonical: url,
          languages: {
            en: `${SITE_URL}/en/blog/${slug}`,
            zh: `${SITE_URL}/zh/blog/${slug}`,
          },
        },
        openGraph: {
          title: meta.title,
          description: meta.description,
          url,
          type: "article",
          siteName: "ToolCraft",
          images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
        },
        twitter: {
          card: "summary_large_image",
          title: meta.title,
          description: meta.description,
          images: [`${SITE_URL}/og-default.png`],
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

  // Extract metadata for JSON-LD
  let postMeta: { title?: string; description?: string; date?: string; category?: string } = {};
  try {
    const raw = readFileSync(filePath, "utf-8");
    const match = raw.match(/export const meta = ({[\s\S]*?});/);
    if (match) {
      postMeta = eval(`(${match[1]})`);
    }
  } catch { /* ignore */ }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postMeta.title ?? slug,
    description: postMeta.description ?? "",
    datePublished: postMeta.date ?? "",
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: "ToolCraft",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ToolCraft",
      url: SITE_URL,
    },
    image: `${SITE_URL}/og-default.png`,
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${locale}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Post />
        <div className="mt-12 flex justify-center">
          <AdUnit format="horizontal" />
        </div>
      </article>
    </>
  );
}
