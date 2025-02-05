import { Inter } from "next/font/google";
import "./globals.css";
import { MobileNav } from "../components/mobile-nav";
import { FinancialProvider } from "../contexts/FinancialContext";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FinancialProvider>
          <div className="min-h-screen bg-background">
            <MobileNav />
            <main className="container pb-16 pt-4">{children}</main>
          </div>
        </FinancialProvider>
      </body>
    </html>
  );
}
