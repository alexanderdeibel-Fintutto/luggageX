import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/profile", "/offers/new", "/requests/new", "/matches"];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("luggagex_session");
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/offers/new", "/requests/new", "/matches/:path*"],
};
