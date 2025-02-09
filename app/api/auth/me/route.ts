import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TEST_ACCOUNTS } from "../test-accounts";

// MVP: Basic session verification endpoint
export async function GET(request: NextRequest) {
  try {
    // MVP: In development, use test session
    if (process.env.NODE_ENV === "development") {
      const session = request.cookies.get("session");

      if (session?.value === "test-session") {
        // For testing, return admin user
        return NextResponse.json({
          data: {
            user: TEST_ACCOUNTS.admin,
          },
        });
      }
    }

    // If no valid session, return unauthorized
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
