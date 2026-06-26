import { NextResponse } from "next/server";

/**
 * Serves the IndexNow key file for Bing/Yandex verification.
 *
 * The key file must be at https://<domain>/<key>.txt and return the key
 * as plain text. Key verification is handled by middleware (src/middleware.ts)
 * which serves `/{key}.txt` directly. This route is a backup for direct
 * API access at `/api/indexnow-key?key=<key>`.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedKey = searchParams.get("key");

  const indexNowKey = process.env.INDEXNOW_KEY;

  if (!indexNowKey) {
    return new NextResponse("IndexNow key not configured", { status: 404 });
  }

  if (requestedKey !== indexNowKey) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(indexNowKey, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
