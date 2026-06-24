import { headers } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getToolRegistry, getToolsByCategory } from "@/lib/tools";
import type { ToolCategory, ToolConfig } from "@/lib/tools/types";
import { ToolCard } from "@/components/layout/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Shield, Zap, ArrowRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

type CategoryValue = "all" | ToolCategory;

function getSubdomain(host: string): ToolCategory | null {
  const parts = host.split(".");
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    const validSubs: ToolCategory[] = ["image", "pdf", "markdown", "dev", "calculator"];
    if (validSubs.includes(sub as ToolCategory)) return sub as ToolCategory;
  }
  return null;
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage.hero" });
  return {
    title: t("title"),
    description:
      locale === "zh"
        ? "免费的在线图片、PDF、Markdown 和开发者工具。所有处理均在浏览器中完成。"
        : "Free online tools for images, PDFs, Markdown, and developers. All processing happens in your browser.",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hp = await getTranslations({ locale, namespace: "homepage" });

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const subdomain = getSubdomain(host);

  const registry = getToolRegistry(locale);
  const filteredTools: ToolConfig[] = subdomain
    ? getToolsByCategory(subdomain, locale)
    : registry;

  const categories = [
    { value: "all", label: hp("categories.all") },
    { value: "image", label: hp("categories.image") },
    { value: "pdf", label: hp("categories.pdf") },
    { value: "markdown", label: hp("categories.markdown") },
    { value: "dev", label: hp("categories.dev") },
    { value: "calculator", label: hp("categories.calculator") },
  ] as const;

  const catKey = subdomain as ToolCategory | null;

  // Subdomain pages: focused category layout
  if (catKey && subdomain) {
    const metaHero = hp(`categoryMeta.${subdomain}.hero`);
    const metaDesc = hp(`categoryMeta.${subdomain}.desc`);

    return (
      <div>
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-sm text-blue-600 font-medium mb-2">
              <Link href="/" className="hover:underline">ToolCraft</Link> / {hp(`categories.${subdomain}`)}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
              {metaHero}
            </h1>
            <p className="text-lg text-zinc-600 mb-4">{metaDesc}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-500" /> {hp("hero.privateSecure")}</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> {hp("hero.instant")}</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-500" /> {hp("hero.free")}</span>
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

        <section className="bg-zinc-50 py-12 px-4 mt-8">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">{hp("exploreMore")}</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {categories.slice(1).map((cat) => (
                cat.value !== subdomain && (
                  <a
                    key={cat.value}
                    href={`https://${cat.value}.toolcraftbox.com/${locale}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border text-sm font-medium text-zinc-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    {hp("categoryLinks", { label: cat.label })} <ArrowRight className="h-3 w-3" />
                  </a>
                )
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Root domain: full homepage
  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            {hp("hero.title")}
          </h1>
          <p className="text-lg text-zinc-600 mb-6 max-w-xl mx-auto">
            {hp("hero.subtitle")}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500 mb-8">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-500" /> {hp("hero.privateSecure")}</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> {hp("hero.instant")}</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-500" /> {hp("hero.free")}</span>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {categories.slice(1).map((cat) => (
              <a
                key={cat.value}
                href={`https://${cat.value}.toolcraftbox.com/${locale}`}
                className="px-4 py-2 bg-white rounded-full border text-sm font-medium text-zinc-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {hp("categoryLinks", { label: cat.label })}
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
              {registry.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getToolsByCategory(cat.value as ToolCategory, locale).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="bg-zinc-50 py-16 px-4 mt-12">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">{hp("whyTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-left">
              <Shield className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">{hp("privacyFirst.title")}</h3>
              <p className="text-sm text-zinc-600">{hp("privacyFirst.description")}</p>
            </div>
            <div className="text-left">
              <Zap className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">{hp("lightningFast.title")}</h3>
              <p className="text-sm text-zinc-600">{hp("lightningFast.description")}</p>
            </div>
            <div className="text-left">
              <Sparkles className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 mb-1">{hp("alwaysFree.title")}</h3>
              <p className="text-sm text-zinc-600">{hp("alwaysFree.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
