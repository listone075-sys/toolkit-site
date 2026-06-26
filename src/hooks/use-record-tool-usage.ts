"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";
import type { UsageHistory } from "@/lib/history/types";
import { recordVisit } from "@/lib/history/storage";

const STORAGE_KEY = "toolcraft-recent-v2";

/**
 * Records a tool visit in localStorage using the enhanced UsageHistory format.
 * Call once on mount from ToolRenderer or any component that represents a tool page view.
 */
export function useRecordToolUsage(slug: string) {
  const [, setHistory] = useLocalStorage<UsageHistory>(STORAGE_KEY, {
    records: [],
    version: 1,
  });

  useEffect(() => {
    if (!slug) return;
    setHistory((prev) => recordVisit(prev, slug));
    // Only run when slug changes (not on every render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
}
