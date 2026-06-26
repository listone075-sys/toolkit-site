import type { UsageHistory, ToolUsageRecord } from "./types";

const NEW_KEY = "toolcraft-recent-v2";
const OLD_KEY = "toolcraft-recent";
const MAX_ITEMS = 10;

/**
 * Read usage history from localStorage.
 * Automatically migrates old flat string[] format to new UsageHistory format.
 */
export function readHistory(): UsageHistory {
  if (typeof window === "undefined") {
    return { records: [], version: 1 };
  }

  try {
    // Try new format first
    const stored = localStorage.getItem(NEW_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.records)) {
        return parsed as UsageHistory;
      }
    }

    // Migrate from old format
    const oldStored = localStorage.getItem(OLD_KEY);
    if (oldStored) {
      const oldSlugs = JSON.parse(oldStored);
      if (Array.isArray(oldSlugs) && oldSlugs.length > 0) {
        const now = Date.now();
        const records: ToolUsageRecord[] = oldSlugs.slice(0, MAX_ITEMS).map((slug: string, i: number) => ({
          slug,
          lastUsedAt: now - i * 60_000, // Stagger timestamps so they aren't all "just now"
          useCount: 1,
        }));
        // Remove old key after migration
        localStorage.removeItem(OLD_KEY);
        return { records, version: 1 };
      }
    }
  } catch {
    // Corrupt data — start fresh
  }

  return { records: [], version: 1 };
}

/**
 * Write usage history to localStorage.
 */
export function writeHistory(history: UsageHistory): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NEW_KEY, JSON.stringify(history));
  } catch {
    // Quota exceeded — silently fail
  }
}

/**
 * Record a tool visit. Returns the updated history.
 */
export function recordVisit(history: UsageHistory, slug: string): UsageHistory {
  const now = Date.now();
  const existing = history.records.find((r) => r.slug === slug);
  const updated: ToolUsageRecord = existing
    ? { ...existing, lastUsedAt: now, useCount: existing.useCount + 1 }
    : { slug, lastUsedAt: now, useCount: 1 };

  const others = history.records.filter((r) => r.slug !== slug);
  return {
    version: 1,
    records: [updated, ...others].slice(0, MAX_ITEMS),
  };
}

/**
 * Format a relative time string from a timestamp.
 */
export function formatTimeAgo(timestamp: number, locale: string): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const isZh = locale === "zh";

  if (seconds < 0) return isZh ? "刚刚" : "just now";
  if (seconds < 60) return isZh ? "刚刚" : "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return isZh ? `${minutes}分钟前` : `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isZh ? `${hours}小时前` : `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return isZh ? `${days}天前` : `${days}d ago`;

  const months = Math.floor(days / 30);
  return isZh ? `${months}个月前` : `${months}mo ago`;
}
