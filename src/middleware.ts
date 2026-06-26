import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
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
  matcher: ["/((?!_next|api|offline|favicon.ico|.*\\..*).*)"],
};
