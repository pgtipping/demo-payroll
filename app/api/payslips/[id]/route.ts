import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get payslip details
    const payslip = await prisma.payslip.findUnique({
      where: {
        id: params.id,
        employeeId: employee.id,
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payslip) {
      return new NextResponse("Payslip not found", { status: 404 });
    }

    // Format payslip for response
    const formattedPayslip = {
      id: payslip.id,
      month: new Date(payslip.periodStart).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      employeeName: `${payslip.employee.user.firstName} ${payslip.employee.user.lastName}`,
      employeeId: payslip.employeeId,
      department: "Engineering", // TODO: Add department to employee model
      position: "Software Engineer", // TODO: Add position to employee model
      grossPay: payslip.grossAmount,
      deductions: [
        {
          name: "Tax",
          amount: payslip.grossAmount * 0.2, // TODO: Implement proper tax calculation
        },
        {
          name: "Health Insurance",
          amount: 200, // TODO: Implement proper insurance calculation
        },
        {
          name: "Pension",
          amount: payslip.grossAmount * 0.05, // TODO: Implement proper pension calculation
        },
      ],
      netPay: payslip.netAmount,
      status: payslip.status,
      paidOn: payslip.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPayslip);
  } catch (error) {
    console.error("Failed to fetch payslip details:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
