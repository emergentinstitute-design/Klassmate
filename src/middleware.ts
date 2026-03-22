import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // If the user is trying to access a dashboard route and is NOT logged in
  if (!isAuthenticated) {
    // Redirect them to the login page
    const loginUrl = new URL("/login", req.url);
    // Optional: Pass the current URL so they can be redirected back after login
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { 
  // This tells Next.js exactly which routes this logic applies to
  matcher: [
    "/admission/:path*", 
    "/enquiry/:path*", 
    "/api/((?!auth).*)",
    // Add any other dashboard routes here
  ] 
};