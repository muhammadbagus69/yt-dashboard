import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("dashboard_auth")?.value;

  if (cookie === process.env.DASHBOARD_PASSWORD) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api/youtube/callback|_next/static|_next/image|favicon.ico).*)"],
};