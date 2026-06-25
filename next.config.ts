import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  async headers() {
    return [
      // Tool pages: security + caching (with locale prefix)
      {
        source: "/:locale(en|zh)/tools/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      // PWA files: no-cache for service worker, short cache for manifest
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      // Blog & legal pages: medium cache (with locale prefix)
      {
        source: "/:locale(en|zh)/(blog|privacy|terms)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      // Locale-prefixed homepage: short cache
      {
        source: "/:locale(en|zh)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      // Root path (legacy / redirect): short cache
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx$/,
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withAnalyzer(withNextIntl(withMDX(nextConfig)));
