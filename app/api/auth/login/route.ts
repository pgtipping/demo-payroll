import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TEST_ACCOUNTS, isTestAccount } from "../test-accounts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Frontend login attempt:", { email: body.email }); // Don't log passwords!

    // MVP: Handle test accounts in development
    if (process.env.NODE_ENV === "development" && isTestAccount(body.email)) {
      const testAccount = Object.values(TEST_ACCOUNTS).find(
        (account) =>
          account.email === body.email && account.password === body.password
      );

      if (testAccount) {
        // Create a session cookie for test accounts
        const response = NextResponse.json(
          { data: { user: testAccount } },
          { status: 200 }
        );

        // Set a test session cookie
        response.cookies.set("session", "test-session", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24 hours
        });

        // Set the user role cookie
        response.cookies.set("user-role", testAccount.role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Production login logic
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    console.log("Backend response status:", response.status);
    const data = await response.json();
    console.log("Backend response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Login failed" },
        { status: response.status }
      );
    }

    // Forward the Set-Cookie header from the backend
    const headers = new Headers();
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log("Received cookies from backend");
      headers.set("set-cookie", cookies);
    } else {
      console.log("No cookies received from backend");
    }

    return NextResponse.json(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
