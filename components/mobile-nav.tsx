"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  UserCircle,
  FileText,
  Settings,
  LogOut,
  Building2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/providers/auth-provider";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>
                <Image
                  src=""
                  alt=""
                  width={120}
                  height={40}
                  className="mx-auto"
                />
              </SheetTitle>
              <SheetDescription>
                Navigate through your payroll application
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4 pt-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setOpen(false)}
              >
                <UserCircle className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/payslips"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setOpen(false)}
              >
                <FileText className="h-5 w-5" />
                Pay Slips
              </Link>
              <Link
                href="/financial-tools"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setOpen(false)}
              >
                <TrendingUp className="h-5 w-5" />
                Financial Tools
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <Building2 className="h-5 w-5" />
                  Admin Portal
                </Link>
              )}
              <Link
                href="/settings"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <Button
                variant="ghost"
                className="flex items-center gap-2 justify-start pl-0 text-lg font-semibold text-secondary"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between">
          <Image src="" alt="" width={100} height={35} />
          <UserCircle className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
}
