/**
 * Global site-wide structured data: Organization + WebSite
 */
export function SiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "ToolCraft",
        url: "https://toolcraftbox.com",
        description:
          "Free online tools for image conversion, PDF manipulation, Markdown editing, and developer utilities.",
        logo: "https://toolcraftbox.com/favicon.ico",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: "ToolCraft",
        url: "https://toolcraftbox.com",
        description:
          "Free online tools — all processing happens in your browser. No file uploads, no sign-ups.",
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
