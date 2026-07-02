"use client";

import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ToolCard } from "./tool-card";
import { getToolRegistry, resolveDeprecatedSlug } from "@/lib/tools";
import { formatTimeAgo, readHistory } from "@/lib/history/storage";
import type { UsageHistory } from "@/lib/history/types";
import { History } from "lucide-react";

const STORAGE_KEY = "toolcraft-recent-v2";

interface RecentSectionProps {
  locale: string;
}

/**
 * Client component that reads recently used tools from localStorage and renders a ToolCard grid.
 * Now supports the enhanced UsageHistory format with timestamps and use counts.
 */
export function RecentSection({ locale }: RecentSectionProps) {
  const t = useTranslations("common");
  const [recent] = useLocalStorage<UsageHistory>(
    STORAGE_KEY,
    typeof window !== "undefined"
      ? readHistory()
      : { records: [], version: 1 },
  );
  const registry = getToolRegistry(locale);

  // Build tool cards with timestamp info
  const recentTools = recent.records
    .map((record) => {
      const tool = registry.find((t) => t.slug === resolveDeprecatedSlug(record.slug));
      return tool ? { tool, lastUsedAt: record.lastUsedAt } : null;
    })
    .filter(Boolean) as { tool: (typeof registry)[number]; lastUsedAt: number }[];

  if (recentTools.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <History className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-bold text-zinc-900">
          {t("recent.title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentTools.map(({ tool, lastUsedAt }) => (
          <div key={tool.slug} className="relative">
            <ToolCard tool={tool} />
            <p className="mt-1 text-xs text-zinc-400 text-center">
              {t("recent.lastUsed", {
                time: formatTimeAgo(lastUsedAt, locale),
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
