"use client";

import { useTranslations } from "next-intl";
import { getRecommendations } from "@/lib/recommendations/engine";
import { ToolCard } from "./tool-card";
import { Lightbulb } from "lucide-react";

interface AfterToolSuggestionsProps {
  slug: string;
  locale: string;
}

/**
 * Client component: shown after a tool produces output (download/success).
 * Renders 2-3 recommended tools inline.
 */
export function AfterToolSuggestions({ slug, locale }: AfterToolSuggestionsProps) {
  const t = useTranslations("common");
  const recommendations = getRecommendations(slug, locale, 3);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <p className="text-sm font-medium text-zinc-600">
          {t("recommendations.youMightLike")}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recommendations.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
