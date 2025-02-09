import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// MVP: Basic logout functionality
export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear all auth-related cookies
    response.cookies.delete("session");
    response.cookies.delete("user-role");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
