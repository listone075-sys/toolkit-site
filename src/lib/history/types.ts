export interface ToolUsageRecord {
  slug: string;
  lastUsedAt: number; // Date.now() timestamp
  useCount: number;
}

export interface UsageHistory {
  records: ToolUsageRecord[];
  version: 1;
}
