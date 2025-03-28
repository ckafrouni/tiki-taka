import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Only protect the beta path and its subpaths
  if (path.startsWith("/beta")) {
    // Check if the access key cookie exists
    const accessKey = request.cookies.get("access-key")?.value;

    // If we're already on the access page or API route, allow the request
    if (path === "/access" || path.startsWith("/api/validate-access")) {
      return NextResponse.next();
    }

    // If the access key cookie doesn't exist or doesn't match, redirect to the access page
    if (!accessKey || accessKey !== process.env.ACCESS_KEY) {
      const url = new URL("/access", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/api/validate-access"],
};
