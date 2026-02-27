// ============================================
// NextAuth API Route Handler
// ============================================
// Handles all auth endpoints:
//   POST /api/auth/signin
//   POST /api/auth/signout
//   GET  /api/auth/session
//   GET  /api/auth/providers
//   etc.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };