import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/payslips/${params.id}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch payslip");
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to fetch payslip",
      }),
      { status: 500 }
    );
  }
}
