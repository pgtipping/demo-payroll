import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch profile");
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
      }),
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      }),
      { status: 500 }
    );
  }
}
