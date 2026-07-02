import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  async redirects() {
    const markdownSlugs = [
      "markdown-to-html",
      "markdown-editor",
      "markdown-table-generator",
      "markdown-to-docx",
      "markdown-to-pptx",
      "docx-to-markdown",
      "html-to-markdown",
      "markdown-formatter",
      "markdown-to-pdf",
      "url-to-markdown",
    ];
    const tabMap: Record<string, string> = {
      "markdown-to-html": "edit",
      "markdown-editor": "edit",
      "markdown-table-generator": "edit",
      "markdown-to-docx": "export",
      "markdown-to-pptx": "export",
      "markdown-to-pdf": "export",
      "markdown-formatter": "beautify",
      "docx-to-markdown": "import",
      "html-to-markdown": "import",
      "url-to-markdown": "import",
    };
    return markdownSlugs.flatMap((slug) => [
      { source: `/en/tools/${slug}`, destination: `/en/tools/markdown?tab=${tabMap[slug]}`, permanent: true },
      { source: `/zh/tools/${slug}`, destination: `/zh/tools/markdown?tab=${tabMap[slug]}`, permanent: true },
    ]);
  },

  async headers() {
    return [
      // Tool pages: security + caching (with locale prefix)
      {
        source: "/:locale(en|zh)/tools/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
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
