import { headers } from "next/headers";

/**
 * Global 404 page — rendered outside locale context.
 * Detects locale from URL path for basic i18n.
 */
export default async function NotFound() {
  const h = await headers();
  const pathname = h.get("x-invoke-path") ?? h.get("x-pathname") ?? "";
  const isZh = pathname.startsWith("/zh");

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
