/**
 * GA4 Data Fetcher
 * Fetches daily analytics data from Google Analytics 4 and updates KPI dashboard.
 *
 * Usage:
 *   GA4_KEY_PATH=../cankao/website-statistics-query-*.json npx tsx scripts/ga4-fetch.ts
 *
 * Or set GA4_SERVICE_ACCOUNT_KEY to the JSON string directly.
 *
 * Required: GA4 property ID (hardcoded below or via GA4_PROPERTY_ID env)
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ---- Config ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? "541266486";
const OPS_DIR = resolve(__dirname, "..", "ops");
const TRACKING_DIR = join(OPS_DIR, "tracking");
const DASHBOARD_PATH = join(TRACKING_DIR, "kpi-dashboard.md");
const DAILY_LOG_DIR = join(TRACKING_DIR, "daily-stats");
const CONFIG_MEMO_PATH = join(OPS_DIR, ".claude", "memory", "config-credentials.md");

// ---- Auth ----
function getClient() {
  const keyPath =
    process.env.GA4_KEY_PATH ??
    (() => {
      const files = readdirSync(join(__dirname, "..", "cankao")).filter(
        (f) => f.startsWith("website-statistics-query") && f.endsWith(".json"),
      );
      return files.length > 0 ? join(__dirname, "..", "cankao", files[0]) : null;
    })();

  const keyJson = keyPath && existsSync(keyPath) ? readFileSync(keyPath, "utf-8") : null;

  const credentials = keyJson ? JSON.parse(keyJson) : undefined;

  if (!credentials) {
    console.error("[GA4] ❌ No service account key found. Set GA4_KEY_PATH or place key in cankao/");
    process.exit(1);
  }

  return new BetaAnalyticsDataClient({ credentials });
}

// ---- Data fetching ----
async function fetchMetrics(days: number = 7) {
  const client = getClient();
  const property = `properties/${PROPERTY_ID}`;

  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    metrics: [
      { name: "activeUsers" },        // UV
      { name: "screenPageViews" },    // PV
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
      { name: "newUsers" },
    ],
    dimensions: [{ name: "date" }],
    orderBy: [{ dimension: { dimensionName: "date" }, desc: false }],
  });

  return response.rows?.map((row) => ({
    date: row.dimensionValues?.[0]?.value ?? "unknown",
    activeUsers: parseInt(row.metricValues?.[0]?.value ?? "0"),
    pageViews: parseInt(row.metricValues?.[1]?.value ?? "0"),
    avgSessionDuration: parseFloat(row.metricValues?.[2]?.value ?? "0"),
    bounceRate: parseFloat(row.metricValues?.[3]?.value ?? "0"),
    newUsers: parseInt(row.metricValues?.[4]?.value ?? "0"),
  })) ?? [];
}

async function fetchTopPages(days: number = 7, limit: number = 10) {
  const client = getClient();
  const property = `properties/${PROPERTY_ID}`;

  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    orderBy: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit,
  });

  return response.rows?.map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "",
    title: row.dimensionValues?.[1]?.value ?? "",
    pageViews: parseInt(row.metricValues?.[0]?.value ?? "0"),
    users: parseInt(row.metricValues?.[1]?.value ?? "0"),
  })) ?? [];
}

async function fetchTrafficSources(days: number = 7) {
  const client = getClient();
  const property = `properties/${PROPERTY_ID}`;

  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
  });

  return response.rows?.map((row) => ({
    channel: row.dimensionValues?.[0]?.value ?? "unknown",
    users: parseInt(row.metricValues?.[0]?.value ?? "0"),
    pageViews: parseInt(row.metricValues?.[1]?.value ?? "0"),
  })) ?? [];
}

// ---- Output helpers ----
function summaryText(daily: Array<{ date: string; activeUsers: number; pageViews: number }>) {
  const totalPV = daily.reduce((s, d) => s + d.pageViews, 0);
  const totalUV = daily.reduce((s, d) => s + d.activeUsers, 0);
  const avgDailyPV = Math.round(totalPV / daily.length);
  const avgDailyUV = Math.round(totalUV / daily.length);
  const lastDay = daily[daily.length - 1]?.pageViews ?? 0;
  return { totalPV, totalUV, avgDailyPV, avgDailyUV, lastDay };
}

// ---- Main ----
async function main() {
  console.log(`[GA4] Fetching data for property ${PROPERTY_ID}...`);

  const daily = await fetchMetrics(7);
  const topPages = await fetchTopPages(7);
  const sources = await fetchTrafficSources(7);

  const summary = summaryText(daily);
  const today = new Date().toISOString().split("T")[0];

  console.log(`\n=== GA4 Report — ${today} ===`);
  console.log(`7-Day Total: ${summary.totalPV} PV / ${summary.totalUV} UV`);
  console.log(`Daily Avg:   ${summary.avgDailyPV} PV / ${summary.avgDailyUV} UV`);
  console.log(`Yesterday:   ${summary.lastDay} PV`);
  console.log(`\nTraffic Sources:`);
  sources.forEach((s) => console.log(`  ${s.channel}: ${s.users} users / ${s.pageViews} PV`));
  console.log(`\nTop Pages:`);
  topPages.forEach((p, i) => console.log(`  ${i + 1}. ${p.path} (${p.pageViews} PV)`));

  // Save daily log
  if (!existsSync(DAILY_LOG_DIR)) {
    mkdirSync(DAILY_LOG_DIR, { recursive: true });
  }
  const logEntry = {
    date: today,
    totalPV_7d: summary.totalPV,
    totalUV_7d: summary.totalUV,
    avgDailyPV: summary.avgDailyPV,
    avgDailyUV: summary.avgDailyUV,
    yesterdayPV: summary.lastDay,
    sources: sources.map((s) => ({ channel: s.channel, users: s.users, pageViews: s.pageViews })),
    topPages: topPages.map((p) => ({ path: p.path, pageViews: p.pageViews, users: p.users })),
  };
  const logFile = join(DAILY_LOG_DIR, `${today}.json`);
  writeFileSync(logFile, JSON.stringify(logEntry, null, 2));
  console.log(`\n[GA4] ✅ Daily log saved to ${logFile}`);

  return logEntry;
}

main().catch((err) => {
  console.error("[GA4] ❌ Fatal error:", err);
  process.exit(1);
});
