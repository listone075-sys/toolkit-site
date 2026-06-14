import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  async headers() {
    return [
      // Tool pages: security + caching
      {
        source: "/tools/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      // Blog & legal pages: medium cache
      {
        source: "/(blog|privacy|terms)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
        ],
      },
      // Homepage: short cache
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

export default withMDX(nextConfig);
