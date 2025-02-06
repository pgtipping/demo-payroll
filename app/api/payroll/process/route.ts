import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/payroll/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to process payroll");
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to process payroll",
      }),
      { status: 500 }
    );
  }
}
