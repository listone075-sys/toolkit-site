import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { Card } from "@/components/ui/card";
import { SITE_URL } from "@/lib/seo/metadata";

interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

function getBlogPosts(locale: string): BlogMeta[] {
  const dir = path.join(process.cwd(), "src/content/blog", locale);
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    return files
      .map((file) => {
        const raw = readFileSync(path.join(dir, file), "utf-8");
        const metaMatch = raw.match(/export const meta = ({[\s\S]*?});/);
        if (!metaMatch) return null;
        try {
          const meta = eval(`(${metaMatch[1]})`);
          return { slug: file.replace(".mdx", ""), ...meta } as BlogMeta;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as BlogMeta[];
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

const BLOG_META: Record<string, { title: string; description: string; heading: string; subtitle: string }> = {
  en: {
    title: "Blog — Free Online Tools Guides & Tips",
    description:
      "Learn how to convert images, edit PDFs, write Markdown, and use developer tools. Step-by-step guides and tutorials.",
    heading: "Blog",
    subtitle: "Guides, tips, and tutorials for our free online tools.",
  },
  zh: {
    title: "博客 — 免费在线工具指南与教程",
    description:
      "学习如何转换图片、编辑PDF、编写Markdown以及使用开发者工具。分步骤的指南和教程。",
    heading: "博客",
    subtitle: "免费在线工具的指南、技巧和教程。",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = BLOG_META[locale] ?? BLOG_META.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        en: `${SITE_URL}/en/blog`,
        zh: `${SITE_URL}/zh/blog`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/blog`,
      type: "website",
      siteName: "ToolCraft",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = BLOG_META[locale] ?? BLOG_META.en;

  // Try locale-specific directory first, fall back to root blog dir
  let posts = getBlogPosts(locale);
  if (posts.length === 0) {
    posts = getBlogPosts("en");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-zinc-900 mb-2">{meta.heading}</h1>
      <p className="text-zinc-600 mb-8">{meta.subtitle}</p>

      {posts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-200 rounded-xl">
          <p className="text-zinc-400">Blog posts coming soon!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="p-6 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-400">{post.date}</span>
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-1">{post.title}</h2>
                <p className="text-sm text-zinc-500">{post.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
