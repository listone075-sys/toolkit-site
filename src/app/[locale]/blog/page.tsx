import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { Card } from "@/components/ui/card";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { headers } = await import("next/headers");
  const hostHeader = (await headers()).get("host") ?? "";
  const protocol = hostHeader.startsWith("localhost") ? "http" : "https";
  const base = hostHeader ? `${protocol}://${hostHeader}` : SITE_URL;

  return {
    title: "Blog — Free Online Tools Guides & Tips",
    description:
      "Learn how to convert images, edit PDFs, write Markdown, and use developer tools. Step-by-step guides and tutorials.",
    alternates: {
      canonical: `${base}/${locale}/blog`,
      languages: {
        en: `${base}/en/blog`,
        zh: `${base}/zh/blog`,
      },
    },
    openGraph: {
      title: "Blog — Free Online Tools Guides & Tips",
      description:
        "Learn how to convert images, edit PDFs, write Markdown, and use developer tools. Step-by-step guides and tutorials.",
      url: `${base}/${locale}/blog`,
      type: "website",
      siteName: "ToolCraft",
      images: [{ url: `${base}/og-default.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog — Free Online Tools Guides & Tips",
      description:
        "Learn how to convert images, edit PDFs, write Markdown, and use developer tools.",
      images: [`${base}/og-default.svg`],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Try locale-specific directory first, fall back to root blog dir
  let posts = getBlogPosts(locale);
  if (posts.length === 0) {
    posts = getBlogPosts("en");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-zinc-900 mb-2">Blog</h1>
      <p className="text-zinc-600 mb-8">Guides, tips, and tutorials for our free online tools.</p>

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
