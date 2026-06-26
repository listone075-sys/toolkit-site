import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Serve IndexNow key file at /{key}.txt
  const txtMatch = pathname.match(/^\/([a-zA-Z0-9]+)\.txt$/);
  if (txtMatch) {
    const requestedKey = txtMatch[1];
    const indexNowKey = process.env.INDEXNOW_KEY;
    if (indexNowKey && requestedKey === indexNowKey) {
      return new NextResponse(indexNowKey, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  const response = intlMiddleware(request) as NextResponse;

  const hasLocaleCookie = request.cookies.has("NEXT_LOCALE");

  if (!hasLocaleCookie) {
    // Check geo-IP headers from hosting platforms (Vercel / Cloudflare)
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      "";

    // Default to Chinese for visitors from China
    if (country.toUpperCase() === "CN") {
      response.cookies.set("NEXT_LOCALE", "zh", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    // All non-file paths (no extension) — intl routing
    "/((?!_next|api|offline|favicon\\.ico|.*\\.[a-z0-9]{2,6}$).*)",
    // IndexNow key files at /{key}.txt
    "/:key([a-zA-Z0-9]+).txt",
  ],
};
