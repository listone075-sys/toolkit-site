"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

const STORAGE_KEY = "toolcraft-recent";
const MAX_ITEMS = 10;

/**
 * Records a tool visit in localStorage. Call once on mount from ToolRenderer
 * or any component that represents a tool page view.
 */
export function useRecordToolUsage(slug: string) {
  const [, setRecent] = useLocalStorage<string[]>(STORAGE_KEY, []);

  useEffect(() => {
    if (!slug) return;
    setRecent((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, MAX_ITEMS);
    });
    // Only run when slug changes (not on every render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
}
