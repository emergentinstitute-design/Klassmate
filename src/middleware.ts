import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 1. Allow the request if the token exists OR it's an auth-related asset
  if (token || pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. If NOT logged in and trying to access ANY protected route (including root)
  if (!token && pathname !== "/login") {
    const loginUrl = new URL("/login", req.url);
    // This ensures that after login, they go back to where they tried to visit
    loginUrl.searchParams.set("callbackUrl", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { 
  /*
   * Match all request paths except for the ones starting with:
   * - api (internal auth APIs)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};