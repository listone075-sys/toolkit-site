import type { ToolCategory } from "@/lib/tools/types";

const categoryLabels: Record<ToolCategory, string> = {
  image: "Image Tools",
  pdf: "PDF Tools",
  markdown: "Markdown Tools",
  dev: "Developer Tools",
  calculator: "Calculators",
};

const categoryUrls: Record<ToolCategory, string> = {
  image: "https://image.toolcraftbox.com",
  pdf: "https://pdf.toolcraftbox.com",
  markdown: "https://markdown.toolcraftbox.com",
  dev: "https://dev.toolcraftbox.com",
  calculator: "https://toolcraftbox.com",
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  category?: ToolCategory;
}

/**
 * Renders breadcrumb navigation with JSON-LD structured data
 */
export function Breadcrumb({ items, category }: BreadcrumbProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: "ToolCraft", url: "https://toolcraftbox.com" },
  ];

  if (category) {
    fullItems.push({
      name: categoryLabels[category],
      url: categoryUrls[category],
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
