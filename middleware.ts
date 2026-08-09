import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // chronimy dashboard
  if (pathname.startsWith("/dashboard") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // zalogowany nie widzi landingu (bez client Loading — ważne dla SEO)
  if (pathname === "/" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // opcjonalnie: blokuj /login gdy już zalogowany
  if (pathname === "/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
