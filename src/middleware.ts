import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = { 
  // Matches all dashboard routes under (dashboard)
  // But excludes the login page and static assets
  matcher: ["/admission/:path*", "/enquiry/:path*", "/api/((?!auth).*)"] 
};