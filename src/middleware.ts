// ============================================
// Route Protection Middleware
// ============================================
// Runs before every request to check if the user
// is authenticated for protected routes

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is logged in and tries to access auth pages,
    // redirect them to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true = allow access, false = redirect to login
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes — always accessible
        const publicRoutes = [
          "/",
          "/login",
          "/register",
          "/pricing",
          "/api/auth",
          "/api/stripe/webhook",
          "/api/paypal/webhook",
        ];

        // Check if current route is public
        const isPublicRoute = publicRoutes.some(
          (route) => pathname === route || pathname.startsWith(route + "/")
        );

        if (isPublicRoute) return true;

        // Protected routes — require authentication
        return !!token;
      },
    },
  }
);

// Apply middleware to these routes
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/calendar/:path*",
    "/board/:path*",
    "/posts/:path*",
    "/settings/:path*",
    // Auth routes (for redirect logic)
    "/login",
    "/register",
    // API routes (except auth and webhooks)
    "/api/posts/:path*",
    "/api/categories/:path*",
    "/api/user/:path*",
  ],
};