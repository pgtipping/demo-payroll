import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/payroll/runs`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch payroll runs");
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch payroll runs",
      }),
      { status: 500 }
    );
  }
}
