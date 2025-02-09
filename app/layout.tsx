import { Inter } from "next/font/google";
import "./globals.css";
import { MobileNav } from "../components/mobile-nav";
import { FinancialProvider } from "../contexts/FinancialContext";
import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { FeatureFlagProvider } from "@/lib/providers/feature-flags";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <FeatureFlagProvider>
            <AuthProvider>
              <FinancialProvider>
                <div className="min-h-screen bg-background">
                  <MobileNav />
                  <main className="container pb-16 pt-4">{children}</main>
                </div>
                <Toaster />
              </FinancialProvider>
            </AuthProvider>
          </FeatureFlagProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
