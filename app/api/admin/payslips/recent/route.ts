import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payslips/recent`,
      {
        headers: {
          Authorization: `Bearer ${session.user.id}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recent payslips");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get recent payslips:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
