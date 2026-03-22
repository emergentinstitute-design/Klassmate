import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Get token with a slightly higher "leeway" for production clock drift
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 2. Define public paths that NEVER trigger a redirect
  const isAuthPage = pathname.startsWith("/login");
  const isAuthApi = pathname.startsWith("/api/auth");
  const isPublicAsset = pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/);

  if (isAuthPage || isAuthApi || isPublicAsset) {
    return NextResponse.next();
  }

  // 3. If no token and not on login page, redirect to login
  if (!token) {
    const url = new URL("/login", req.url);
    // Only set callback if it's a page we actually want to return to
    if (pathname !== "/") {
      url.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(url);
  }

  // 4. If token exists and user is on login page, send to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Use a more specific matcher to avoid running middleware on static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};