import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"];

// Routes that require admin role
const adminRoutes = ["/admin", "/dashboard/employees", "/dashboard/payroll"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // MVP: Check for session
  const session = request.cookies.get("session");
  const isTestSession =
    process.env.NODE_ENV === "development" && session?.value === "test-session";

  // If no session and not a test session, redirect to login
  if (!session && !isTestSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // MVP: In development with test session, allow all access
  if (isTestSession) {
    return NextResponse.next();
  }

  // Production checks for admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    const userRole = request.cookies.get("user-role")?.value;
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
