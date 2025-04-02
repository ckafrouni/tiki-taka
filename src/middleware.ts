import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/beta")) {
    const accessKey = request.cookies.get("access-key")?.value;
    if (path === "/access" || path.startsWith("/api/validate-access")) {
      return NextResponse.next();
    }

    if (!accessKey || accessKey !== process.env.ACCESS_KEY) {
      const url = new URL("/access", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/api/validate-access"],
};
