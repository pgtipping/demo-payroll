import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current month's payroll total
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const monthlyTotal = await prisma.payslip.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: "PROCESSED",
      },
      _sum: {
        netAmount: true,
      },
    });

    return NextResponse.json({ total: monthlyTotal._sum.netAmount || 0 });
  } catch (error) {
    console.error("Failed to get monthly payroll total:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
