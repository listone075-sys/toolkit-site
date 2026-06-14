import { readFileSync, readdirSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  try {
    const dir = path.join(process.cwd(), "src/content/blog");
    return readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ slug: f.replace(".mdx", "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);
  try {
    const raw = readFileSync(filePath, "utf-8");
    const match = raw.match(/export const meta = ({[\s\S]*?});/);
    if (match) {
      const meta = eval(`(${match[1]})`);
      return { title: `${meta.title} | ToolKit Blog`, description: meta.description };
    }
  } catch { /* not found */ }
  return { title: "Blog Post | ToolKit" };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);

  try {
    readFileSync(filePath);
  } catch {
    notFound();
  }

  // Dynamic import of MDX
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Post />
    </article>
  );
}
