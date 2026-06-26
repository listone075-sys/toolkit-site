"use client";

import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getToolRegistry } from "@/lib/tools";
import { readHistory, formatTimeAgo } from "@/lib/history/storage";
import type { UsageHistory } from "@/lib/history/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ContinueWorkingProps {
  locale: string;
}

/**
 * Shows the most recently used tool with a "Continue" prompt.
 * Appears only when there is history data.
 */
export function ContinueWorking({ locale }: ContinueWorkingProps) {
  const t = useTranslations("common");
  const [history] = useLocalStorage<UsageHistory>(
    "toolcraft-recent-v2",
    { records: [], version: 1 },
  );

  if (history.records.length === 0) return null;

  const latest = history.records[0];
  const registry = getToolRegistry(locale);
  const tool = registry.find((t) => t.slug === latest.slug);
  if (!tool) return null;

  const timeAgo = formatTimeAgo(latest.lastUsedAt, locale);

  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-bold text-zinc-900">
          {t("continueWorking.title")}
        </h2>
      </div>
      <Link href={`/tools/${latest.slug}`}>
        <Card className="p-4 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-900">{tool.title}</h3>
            <p className="text-sm text-zinc-500">
              {t("continueWorking.lastUsed", { time: timeAgo })}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t("continueWorking.usedCount", { count: latest.useCount })}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0">
            {t("continueWorking.continue")}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      </Link>
    </section>
  );
}
