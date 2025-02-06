import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Frontend login attempt:", { email: body.email }); // Don't log passwords!

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
      return new NextResponse(
        JSON.stringify({ error: data.error || "Login failed" }),
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

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
