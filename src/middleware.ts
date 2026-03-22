import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // If authenticated → allow
  if (token) {
    return NextResponse.next();
  }

  // If not → redirect to login
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);

  return NextResponse.redirect(loginUrl);
}

export const config = { 
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};