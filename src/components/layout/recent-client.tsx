"use client";

import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ToolCard } from "./tool-card";
import { getToolRegistry } from "@/lib/tools";
import { History } from "lucide-react";

const STORAGE_KEY = "toolcraft-recent";

interface RecentSectionProps {
  locale: string;
}

/**
 * Client component that reads recently used tools from localStorage and renders a ToolCard grid.
 */
export function RecentSection({ locale }: RecentSectionProps) {
  const t = useTranslations("common");
  const [recent] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const registry = getToolRegistry(locale);

  const recentTools = recent
    .map((slug) => registry.find((t) => t.slug === slug))
    .filter(Boolean);

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
        {recentTools.map((tool) => (
          <ToolCard key={tool!.slug} tool={tool!} />
        ))}
      </div>
    </section>
  );
}
