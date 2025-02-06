import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend with cookies
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
