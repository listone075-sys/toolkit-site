"use client";

import type { ToolCategory } from "@/lib/tools/types";
import { useTranslations, useLocale } from "next-intl";

const SITE_URL = "https://toolcraftbox.com";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  category?: ToolCategory;
}

/**
 * Renders breadcrumb navigation with JSON-LD structured data.
 * All links use the main domain (single-domain architecture).
 */
export function Breadcrumb({ items, category }: BreadcrumbProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  const categoryLabels: Record<ToolCategory, string> = {
    image: t("breadcrumb.imageTools"),
    pdf: t("breadcrumb.pdfTools"),
    markdown: t("breadcrumb.markdownTools"),
    dev: t("breadcrumb.devTools"),
    calculator: t("breadcrumb.calculators"),
  };

  const fullItems: BreadcrumbItem[] = [
    { name: t("breadcrumb.home"), url: `${SITE_URL}/${locale}` },
  ];

  if (category) {
    fullItems.push({
      name: categoryLabels[category],
      url: `${SITE_URL}/${locale}`, // Link to homepage (category tabs are there)
    });
  }

  fullItems.push(...items);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      {/* Visual breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-zinc-500 flex-wrap">
          {fullItems.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-zinc-300">/</span>}
              {i < fullItems.length - 1 ? (
                <a href={item.url} className="hover:text-blue-600 transition-colors">
                  {item.name}
                </a>
              ) : (
                <span className="text-zinc-900 font-medium">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
