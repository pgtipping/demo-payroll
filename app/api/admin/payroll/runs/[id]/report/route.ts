import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get payroll run details
    const payrollRun = await prisma.payrollRun.findUnique({
      where: {
        id: params.id,
      },
      include: {
        payslips: {
          include: {
            employee: {
              include: {
                user: true,
                salaryInfo: true,
                deductions: {
                  where: {
                    active: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!payrollRun) {
      return new NextResponse("Payroll run not found", { status: 404 });
    }

    // Create PDF document
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const result = Buffer.concat(chunks);
      return new NextResponse(result, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="payroll-report-${payrollRun.id}.pdf"`,
        },
      });
    });

    // Add content to PDF
    doc.fontSize(20).text("Payroll Report", { align: "center" }).moveDown();

    doc
      .fontSize(12)
      .text(
        `Period: ${new Date(payrollRun.periodStart).toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric",
          }
        )}`,
        { align: "left" }
      )
      .moveDown();

    // Summary section
    doc.fontSize(16).text("Summary", { underline: true }).moveDown();

    const totalGross = payrollRun.payslips.reduce(
      (sum, p) => sum + p.grossAmount,
      0
    );
    const totalDeductions = payrollRun.payslips.reduce(
      (sum, p) => sum + p.deductions,
      0
    );
    const totalNet = payrollRun.payslips.reduce(
      (sum, p) => sum + p.netAmount,
      0
    );

    doc
      .fontSize(12)
      .text(`Total Employees: ${payrollRun.payslips.length}`)
      .text(`Total Gross Pay: $${totalGross.toFixed(2)}`)
      .text(`Total Deductions: $${totalDeductions.toFixed(2)}`)
      .text(`Total Net Pay: $${totalNet.toFixed(2)}`)
      .moveDown();

    // Employee details section
    doc.fontSize(16).text("Employee Details", { underline: true }).moveDown();

    payrollRun.payslips.forEach((payslip) => {
      doc
        .fontSize(12)
        .text(
          `${payslip.employee.user.firstName} ${payslip.employee.user.lastName}`
        )
        .text(`Employee ID: ${payslip.employee.id}`)
        .text(`Gross Pay: $${payslip.grossAmount.toFixed(2)}`)
        .text(`Deductions: $${payslip.deductions.toFixed(2)}`)
        .text(`Net Pay: $${payslip.netAmount.toFixed(2)}`)
        .moveDown();
    });

    // End the document
    doc.end();

    return new NextResponse(Buffer.concat(chunks), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="payroll-report-${payrollRun.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate payroll report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
