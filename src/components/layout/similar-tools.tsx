import { getTranslations } from "next-intl/server";
import { getRecommendations } from "@/lib/recommendations/engine";
import { ToolCard } from "./tool-card";
import { Lightbulb } from "lucide-react";

interface SimilarToolsProps {
  slug: string;
  locale: string;
}

/**
 * Server component: renders "Similar Tools" section on tool pages.
 * Calls the rule-based recommendation engine and shows top 4 results.
 */
export async function SimilarTools({ slug, locale }: SimilarToolsProps) {
  const t = await getTranslations({ locale, namespace: "common" });
  const recommendations = getRecommendations(slug, locale, 4);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold text-zinc-900">
          {t("recommendations.similarTools")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
