import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { month, year } = body;

    if (!month || !year) {
      return new NextResponse("Month and year are required", { status: 400 });
    }

    // Check if payroll has already been processed for this period
    const existingRun = await prisma.payrollRun.findFirst({
      where: {
        periodStart: new Date(Number(year), Number(month) - 1, 1),
        status: {
          in: ["PENDING", "PROCESSING", "COMPLETED"],
        },
      },
    });

    if (existingRun) {
      return new NextResponse(
        `Payroll for ${month}/${year} has already been processed or is in progress`,
        { status: 400 }
      );
    }

    // Create a new payroll run
    const payrollRun = await prisma.payrollRun.create({
      data: {
        periodStart: new Date(Number(year), Number(month) - 1, 1),
        periodEnd: new Date(Number(year), Number(month), 0),
        status: "PROCESSING",
      },
    });

    // Get all active employees
    const employees = await prisma.employee.findMany({
      where: {
        user: {
          status: "active",
        },
      },
      include: {
        salaryInfo: true,
        deductions: {
          where: {
            active: true,
          },
        },
      },
    });

    // Process payroll for each employee
    const payslipPromises = employees.map(async (employee) => {
      const grossAmount = employee.salaryInfo?.amount || 0;
      const deductions = employee.deductions.reduce(
        (total, d) => total + d.amount,
        0
      );
      const netAmount = grossAmount - deductions;

      return prisma.payslip.create({
        data: {
          employeeId: employee.id,
          payrollRunId: payrollRun.id,
          grossAmount,
          netAmount,
          deductions,
          status: "PROCESSED",
        },
      });
    });

    await Promise.all(payslipPromises);

    // Update payroll run status
    await prisma.payrollRun.update({
      where: {
        id: payrollRun.id,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Payroll processed successfully",
      runId: payrollRun.id,
    });
  } catch (error) {
    console.error("Failed to process payroll:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
