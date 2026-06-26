import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getToolRegistry, getToolsByCategory } from "@/lib/tools";
import type { ToolCategory } from "@/lib/tools/types";
import { ToolCard } from "@/components/layout/tool-card";
import { FavoritesSection } from "@/components/layout/favorites-client";
import { RecentSection } from "@/components/layout/recent-client";
import { NewsletterSection } from "@/components/layout/newsletter-form";
import { AdUnit } from "@/components/layout/ad-unit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Zap } from "lucide-react";
import { SITE_URL } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage.hero" });

  const description =
    locale === "zh"
      ? "免费的在线图片、PDF、Markdown 和开发者工具。所有处理均在浏览器中完成。"
      : "Free online tools for images, PDFs, Markdown, and developers. All processing happens in your browser.";

  const titleText = t("title");

  return {
    title: titleText,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        zh: `${SITE_URL}/zh`,
      },
    },
    openGraph: {
      title: titleText,
      description,
      url: `${SITE_URL}/${locale}`,
      type: "website",
      siteName: "ToolCraft",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hp = await getTranslations({ locale, namespace: "homepage" });

  const registry = getToolRegistry(locale);

  const categories = [
    { value: "all", label: hp("categories.all") },
    { value: "image", label: hp("categories.image") },
    { value: "pdf", label: hp("categories.pdf") },
    { value: "markdown", label: hp("categories.markdown") },
    { value: "dev", label: hp("categories.dev") },
    { value: "calculator", label: hp("categories.calculator") },
  ] as const;

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
        </div>
      </section>

      {/* AI Tools featured section */}
      {(() => {
        const aiTools = registry.filter((t) => t.isAi);
        if (aiTools.length === 0) return null;
        return (
          <section className="container mx-auto px-4 pt-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-bold text-zinc-900">
                {hp("aiSection.title")}
              </h2>
              <Badge className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                {hp("aiSection.new")}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })()}

      {/* Favorites + Recent sections (client-side, only shown when data exists) */}
      <FavoritesSection locale={locale} />
      <RecentSection locale={locale} />

      {/* Ad Unit */}
      <div className="container mx-auto px-4 pt-10 flex justify-center">
        <AdUnit format="horizontal" />
      </div>

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
              {registry.filter((t) => !t.isAi).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </TabsContent>

          {categories.slice(1).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getToolsByCategory(cat.value as ToolCategory, locale).filter((t) => !t.isAi).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Newsletter — shown after 3+ tool visits */}
      <NewsletterSection />

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
