import type { ToolConfig } from "@/lib/tools/types";
import { getToolRegistry, getToolBySlug } from "@/lib/tools";

/**
 * Rule-based recommendation engine. Scores tools against the current tool
 * using multiple signals then returns the top N.
 */

// Complementary tool pairs — using one tool suggests the other
const COMPLEMENTARY: Record<string, string[]> = {
  "image-compressor": ["image-resizer"],
  "image-resizer": ["image-compressor"],
  "merge-pdf": ["split-pdf", "compress-pdf", "rotate-pdf"],
  "split-pdf": ["merge-pdf", "compress-pdf"],
  "compress-pdf": ["merge-pdf", "split-pdf"],
  "rotate-pdf": ["merge-pdf", "split-pdf"],
  "markdown": ["json-formatter", "text-diff-checker", "html-to-markdown"],
  "json-formatter": ["css-formatter", "text-diff-checker", "markdown"],
  "css-formatter": ["json-formatter", "text-diff-checker"],
  "text-diff-checker": ["json-formatter", "css-formatter", "markdown"],
};

// Search volume tiers for similarity grouping
function volumeTier(searchVolume: string): number {
  if (searchVolume.includes("M")) return 5;
  if (searchVolume.includes("K")) {
    const num = parseFloat(searchVolume.replace(/[~,K]/g, ""));
    if (num >= 500) return 4;
    if (num >= 200) return 3;
    if (num >= 50) return 2;
    return 1;
  }
  // Plain number (no suffix): parse and classify
  const num = parseFloat(searchVolume.replace(/[~,]/g, ""));
  if (Number.isNaN(num)) return 0;
  if (num >= 500000) return 4;
  if (num >= 200000) return 3;
  if (num >= 50000) return 2;
  if (num > 0) return 1;
  return 0;
}

/**
 * Return up to `limit` recommended tools for the given slug, sorted by relevance.
 */
export function getRecommendations(
  currentSlug: string,
  locale: string,
  limit = 4,
): ToolConfig[] {
  const registry = getToolRegistry(locale);
  const current = getToolBySlug(currentSlug, locale);
  if (!current || registry.length === 0) return [];

  const currentKeywords = new Set(current.keywords.map((k) => k.toLowerCase()));
  const currentTier = volumeTier(current.searchVolume);
  const complementary = new Set(COMPLEMENTARY[currentSlug] ?? []);

  const scored = registry
    .filter((t) => t.slug !== currentSlug) // Exclude self
    .map((tool) => {
      let score = 0;

      // Same category: +3
      if (tool.category === current.category) score += 3;

      // Complementary pair: +5
      if (complementary.has(tool.slug)) score += 5;

      // Keyword overlap: +2 per shared keyword
      for (const kw of tool.keywords) {
        if (currentKeywords.has(kw.toLowerCase())) score += 2;
      }

      // Same search-volume tier: +1
      if (volumeTier(tool.searchVolume) === currentTier) score += 1;

      return { tool, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool }) => tool);

  return scored;
}
