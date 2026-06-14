import { notFound } from "next/navigation";
import { use } from "react";
import { getToolBySlug } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo/metadata";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return { title: "Tool Not Found" };
  }
  return generateToolMetadata(tool);
}

export default function ToolPage({ params }: Props) {
  const { slug } = use(params);
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{tool.title}</h1>
        <p className="text-zinc-600 max-w-2xl">{tool.description}</p>
      </div>

      {/* Tool Component (client-side renderer) */}
      <ToolRenderer slug={slug} />

      {/* How to Use */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          {tool.howToUse.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

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
