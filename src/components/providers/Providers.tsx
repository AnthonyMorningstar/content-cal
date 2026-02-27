// ============================================
// Global Providers Wrapper
// ============================================
// Wraps the entire app with all required providers:
// - NextAuth SessionProvider (authentication)
// - next-themes ThemeProvider (dark/light mode)
// - react-hot-toast Toaster (notifications)

"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}

        {/* ---- Toast Notifications ---- */}
        <Toaster
          position="bottom-right"
          gutter={12}
          containerStyle={{ bottom: 20, right: 20 }}
          toastOptions={{
            // Default styling for all toasts
            duration: 4000,
            style: {
              background: "var(--toast-bg)",
              color: "var(--toast-color)",
              border: "1px solid var(--toast-border)",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}