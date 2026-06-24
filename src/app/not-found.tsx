import Link from "next/link";

/**
 * Global 404 page — rendered outside locale context, so no translations here.
 * For locale-aware 404s, the per-locale layout handles missing routes.
 */
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-sans">
          <h1 className="text-6xl font-bold text-zinc-200">404</h1>
          <h2 className="text-xl font-semibold text-zinc-900 mt-4">Page Not Found</h2>
          <p className="text-zinc-600 mt-2 text-center max-w-md">
            The page you&apos;re looking for doesn&apos;t exist. Try one of our free online tools instead.
          </p>
          <Link
            href="/en"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
