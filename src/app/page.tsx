import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { toolRegistry, getToolsByCategory } from "@/lib/tools";
import type { ToolCategory, ToolConfig } from "@/lib/tools/types";
import { ToolCard } from "@/components/layout/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Shield, Zap, ArrowRight } from "lucide-react";

const categories = [
  { value: "all", label: "All Tools" },
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
  { value: "markdown", label: "Markdown" },
  { value: "dev", label: "Dev Tools" },
] as const;

const categoryMeta: Record<ToolCategory, { hero: string; desc: string }> = {
  image: {
    hero: "Image Tools",
    desc: "Convert, compress, and optimize images — all in your browser, no uploads needed.",
  },
  pdf: {
    hero: "PDF Tools",
    desc: "Convert images to PDF, extract pages, merge documents — entirely browser-based.",
  },
  markdown: {
    hero: "Markdown Tools",
    desc: "Write, preview, and convert Markdown. Perfect for AI chat outputs, docs, and README files.",
  },
  dev: {
    hero: "Developer Tools",
    desc: "Format JSON, encode Base64, generate UUIDs — fast, free, and private.",
  },
  calculator: {
    hero: "Calculators",
    desc: "Free online calculators for finance, health, and everyday use.",
  },
};

function getSubdomain(host: string): ToolCategory | null {
  const parts = host.split(".");
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    if (sub in categoryMeta) return sub as ToolCategory;
  }
  return null;
}

export default async function HomePage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const subdomain = getSubdomain(host);

  const filteredTools: ToolConfig[] = subdomain
    ? getToolsByCategory(subdomain)
    : toolRegistry;

  const meta = subdomain ? categoryMeta[subdomain] : null;

  // Subdomain pages: different layout (focused on category)
  if (meta && subdomain) {
    return (
      <div>
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-sm text-blue-600 font-medium mb-2">
              <Link href="https://toolcraftbox.com" className="hover:underline">ToolCraft</Link> / {subdomain}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
              {meta.hero}
            </h1>
            <p className="text-lg text-zinc-600 mb-4">{meta.desc}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-500" /> Private & Secure</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Instant</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-500" /> Free</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Link to other tools */}
        <section className="bg-zinc-50 py-12 px-4 mt-8">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Explore more tools</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {categories.slice(1).map((cat) => (
                cat.value !== subdomain && (
                  <a
                    key={cat.value}
                    href={`https://${cat.value}.toolcraftbox.com`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border text-sm font-medium text-zinc-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    {cat.label} <ArrowRight className="h-3 w-3" />
                  </a>
                )
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Root domain: full homepage with all tools
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            ToolCraft — Free Online Tools
          </h1>
          <p className="text-lg text-zinc-600 mb-6 max-w-xl mx-auto">
            Convert images, edit PDFs, write Markdown, format code — all in your browser.
            No uploads, no sign-ups, 100% free.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500 mb-8">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-500" /> Private & Secure</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Instant</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-500" /> Free</span>
          </div>

          {/* Quick links to category sites */}
          <div className="flex justify-center gap-3 flex-wrap">
            {categories.slice(1).map((cat) => (
              <a
                key={cat.value}
                href={`https://${cat.value}.toolcraftbox.com`}
                className="px-4 py-2 bg-white rounded-full border text-sm font-medium text-zinc-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {cat.label} Tools →
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <TabsList>
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolRegistry.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getToolsByCategory(cat.value as ToolCategory).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="bg-zinc-50 py-16 px-4 mt-12">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Why ToolCraft?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-left">
              <Shield className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">Privacy First</h3>
              <p className="text-sm text-zinc-600">All tools run in your browser. Files never leave your device.</p>
            </div>
            <div className="text-left">
              <Zap className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">Lightning Fast</h3>
              <p className="text-sm text-zinc-600">No server round-trips. Processing happens instantly.</p>
            </div>
            <div className="text-left">
              <Sparkles className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">Always Free</h3>
              <p className="text-sm text-zinc-600">No limits, no premium tiers. All tools free forever.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
