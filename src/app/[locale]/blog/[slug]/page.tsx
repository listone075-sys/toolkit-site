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
      return {
        title: meta.title,
        description: meta.description,
        alternates: {
          canonical: `${SITE_URL}/${locale}/blog/${slug}`,
          languages: {
            en: `${SITE_URL}/en/blog/${slug}`,
            zh: `${SITE_URL}/zh/blog/${slug}`,
          },
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

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Post />
    </article>
  );
}
