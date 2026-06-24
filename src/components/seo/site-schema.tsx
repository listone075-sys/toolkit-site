"use client";

import { useTranslations } from "next-intl";

/**
 * Global site-wide structured data: Organization + WebSite
 */
export function SiteSchema() {
  const t = useTranslations("seo");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: t("siteName"),
        url: "https://toolcraftbox.com",
        description: t("siteDescription"),
        logo: "https://toolcraftbox.com/favicon.ico",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: t("siteName"),
        url: "https://toolcraftbox.com",
        description: t("siteDescription"),
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://toolcraftbox.com/tools/{search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
