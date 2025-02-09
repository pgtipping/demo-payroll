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

    const payrollRuns = await prisma.payrollRun.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            payslips: true,
          },
        },
        payslips: {
          select: {
            netAmount: true,
          },
        },
      },
    });

    const formattedRuns = payrollRuns.map((run) => ({
      id: run.id,
      period: new Date(run.periodStart).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      totalEmployees: run._count.payslips,
      totalAmount: run.payslips.reduce((sum, p) => sum + p.netAmount, 0),
      status: run.status.toLowerCase(),
      createdAt: run.createdAt.toISOString(),
      completedAt: run.completedAt?.toISOString(),
    }));

    return NextResponse.json({ runs: formattedRuns });
  } catch (error) {
    console.error("Failed to fetch payroll runs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
