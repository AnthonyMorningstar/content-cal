// ============================================
// NextAuth Configuration
// ============================================

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Use Prisma to store users, accounts, sessions
  adapter: PrismaAdapter(prisma),

  // Configure authentication providers
  providers: [
    // ---- Google OAuth ----
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // ---- GitHub OAuth ----
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),

    // ---- Email + Password ----
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists and has a password (not OAuth-only)
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user object (this gets encoded into the JWT)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  // Use JWT strategy (required for credentials provider)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Callbacks to customize JWT and session
  callbacks: {
    // Add user ID to JWT token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }

      // Handle session update (e.g., after profile change)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
      }

      return token;
    },

    // Add user ID to session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Events for side effects
  events: {
    // When a new user signs up via OAuth, create their free subscription
    async createUser({ user }) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
        },
      });
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",

  // Secret for JWT encryption
  // Fallback during build to prevent initialization errors
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build-only",
};