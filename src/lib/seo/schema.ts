import type { ToolConfig } from "@/lib/tools/types";

/**
 * Generate HowTo structured data for a tool
 */
export function generateHowToSchema(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.title,
    description: tool.description,
    step: tool.howToUse.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
}

/**
 * Generate FAQ structured data for a tool
 */
export function generateFAQSchema(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate SoftwareApplication structured data
 */
export function generateSoftwareSchema(tool: ToolConfig) {
  return {
    "@context": "https://schema.org",
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
    browserRequirements: "Requires JavaScript",
  };
}
