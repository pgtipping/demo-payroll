import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get YTD earnings for the current employee
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const ytdEarnings = await prisma.payslip.aggregate({
      where: {
        employeeId: session.user.id,
        createdAt: {
          gte: startOfYear,
          lte: currentDate,
        },
        status: "PROCESSED",
      },
      _sum: {
        netAmount: true,
      },
    });

    return NextResponse.json({ total: ytdEarnings._sum.netAmount || 0 });
  } catch (error) {
    console.error("Failed to get YTD earnings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
