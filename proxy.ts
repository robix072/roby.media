import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  // Româna stă la rădăcină: /ro/... → /... cu redirect permanent (308), bun pentru SEO.
  const { pathname, search } = req.nextUrl;
  if (pathname === "/ro" || pathname.startsWith("/ro/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    url.search = search;
    return NextResponse.redirect(url, 308);
  }
  return intl(req);
}

export const config = {
  // Toate rutele, mai puțin API, fișierele interne Next și fișierele statice (cu extensie).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
