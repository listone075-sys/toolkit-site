import Fuse from "fuse.js";
import { getToolRegistry } from "@/lib/tools";
import type { ToolConfig } from "@/lib/tools/types";

let fuseInstance: Fuse<ToolConfig> | null = null;
let fuseLocale = "";

function getFuse(locale: string): Fuse<ToolConfig> {
  if (fuseInstance && fuseLocale === locale) {
    return fuseInstance;
  }

  const registry = getToolRegistry(locale);

  fuseInstance = new Fuse(registry, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "description", weight: 0.3 },
      { name: "keywords", weight: 0.2 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  });

  fuseLocale = locale;
  return fuseInstance;
}

export function searchTools(
  query: string,
  locale: string,
  limit = 8,
): ToolConfig[] {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const fuse = getFuse(locale);
  return fuse
    .search(trimmed)
    .slice(0, limit)
    .map((r) => r.item);
}
