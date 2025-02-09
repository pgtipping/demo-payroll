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

    const recentPayslips = await prisma.payslip.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formattedPayslips = recentPayslips.map((payslip) => ({
      id: payslip.id,
      employeeName: `${payslip.employee.firstName} ${payslip.employee.lastName}`,
      period: new Date(payslip.periodStart).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      amount: payslip.netAmount,
      status: payslip.status,
    }));

    return NextResponse.json({ payslips: formattedPayslips });
  } catch (error) {
    console.error("Failed to get recent payslips:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
