import { headers } from "next/headers";

/**
 * Detect the requested locale from available headers.
 * Tries multiple sources in priority order:
 * 1. x-invoke-path (Vercel) or referer — parse /zh or /en prefix from path
 * 2. accept-language — check for zh-* preference
 * Falls back to "en".
 */
function detectLocale(pathHeader: string | null, referer: string | null, acceptLang: string | null): "zh" | "en" {
  // Try path-based detection first (most reliable)
  const pathSource = pathHeader ?? referer ?? "";
  if (pathSource.startsWith("/zh") || pathSource.includes("/zh/") || pathSource.includes("/zh?")) {
    return "zh";
  }
  if (pathSource.startsWith("/en") || pathSource.includes("/en/") || pathSource.includes("/en?")) {
    return "en";
  }
  // Fall back to accept-language header
  if (acceptLang && acceptLang.toLowerCase().startsWith("zh")) {
    return "zh";
  }
  return "en";
}

/**
 * Global 404 page — rendered outside locale context.
 * Detects locale from request headers for basic i18n.
 */
export default async function NotFound() {
  const h = await headers();
  const pathHeader = h.get("x-invoke-path") ?? h.get("x-pathname") ?? null;
  const referer = h.get("referer") ?? null;
  const acceptLang = h.get("accept-language") ?? null;
  const isZh = detectLocale(pathHeader, referer, acceptLang) === "zh";

  const title = isZh ? "页面未找到" : "Page Not Found";
  const description = isZh
    ? "您查找的页面不存在。请尝试我们的免费在线工具。"
    : "The page you're looking for doesn't exist. Try one of our free online tools instead.";
  const backText = isZh ? "返回首页" : "Back to Home";

  return (
    <html lang={isZh ? "zh" : "en"}>
      <head>
        {/* Prevent indexing of 404 pages */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>404 — {title}</title>
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-sans">
          <h1 className="text-6xl font-bold text-zinc-200">404</h1>
          <h2 className="text-xl font-semibold text-zinc-900 mt-4">{title}</h2>
          <p className="text-zinc-600 mt-2 text-center max-w-md">{description}</p>
          <a
            href={isZh ? "/zh" : "/en"}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {backText}
          </a>
        </div>
      </body>
    </html>
  );
}
