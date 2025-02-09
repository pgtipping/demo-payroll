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

    // Get employee ID from user ID
    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // Get all payslips for the employee
    const payslips = await prisma.payslip.findMany({
      where: {
        employeeId: employee.id,
      },
      orderBy: {
        periodStart: "desc",
      },
    });

    // Calculate YTD totals
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    const ytdTotals = await prisma.payslip.aggregate({
      where: {
        employeeId: employee.id,
        periodStart: {
          gte: startOfYear,
        },
        status: "PROCESSED",
      },
      _sum: {
        grossAmount: true,
        netAmount: true,
      },
    });

    // Format payslips for response
    const formattedPayslips = payslips.map((payslip) => ({
      id: payslip.id,
      month: new Date(payslip.periodStart).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      grossPay: payslip.grossAmount,
      netPay: payslip.netAmount,
      deductions: payslip.grossAmount - payslip.netAmount,
      status: payslip.status,
      paidOn: payslip.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      payslips: formattedPayslips,
      ytdSummary: {
        totalEarnings: ytdTotals._sum.grossAmount || 0,
        totalDeductions:
          (ytdTotals._sum.grossAmount || 0) - (ytdTotals._sum.netAmount || 0),
        netIncome: ytdTotals._sum.netAmount || 0,
      },
    });
  } catch (error) {
    console.error("Failed to fetch payslips:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
