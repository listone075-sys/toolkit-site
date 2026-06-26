import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getToolBySlug } from "@/lib/tools";
import { generateToolMetadata, SITE_URL } from "@/lib/seo/metadata";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { AdUnit } from "@/components/layout/ad-unit";
import { FavoritesButton } from "@/components/layout/favorites-button";
import { SimilarTools } from "@/components/layout/similar-tools";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug, locale);
  if (!tool) {
    return { title: "Tool Not Found" };
  }
  return generateToolMetadata(tool, locale);
}

export default async function ToolPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getToolBySlug(slug, locale);

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumb
        category={tool.category}
        items={[{ name: tool.title, url: `${SITE_URL}/${locale}/tools/${tool.slug}` }]}
      />

      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-zinc-900">{tool.title}</h1>
          <FavoritesButton toolSlug={slug} iconOnly={false} className="mt-1" />
        </div>
        <p className="text-zinc-600 max-w-2xl">{tool.description}</p>
      </div>

      {/* Tool Component (client-side renderer) */}
      <ToolRenderer slug={slug} />

      {/* Ad Unit */}
      <div className="mt-8 flex justify-center">
        <AdUnit format="horizontal" />
      </div>

      {/* How to Use */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          {tool.howToUse.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Similar Tools */}
      <SimilarTools slug={slug} locale={locale} />

      {/* FAQs */}
      <div className="mt-10 mb-12">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {tool.faqs.map((faq, i) => (
            <details key={i} className="group border rounded-lg p-4">
              <summary className="font-medium text-zinc-900 cursor-pointer group-open:text-blue-600">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "HowTo",
                name: tool.title,
                description: tool.description,
                step: tool.howToUse.map((text, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  text,
                })),
              },
              {
                "@type": "FAQPage",
                mainEntity: tool.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              },
              {
                "@type": "SoftwareApplication",
                name: tool.title,
                description: tool.description,
                applicationCategory: "WebApplication",
                operatingSystem: "Any",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
