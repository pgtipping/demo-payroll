import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface PayslipData {
  id: string;
  month: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  grossPay: number;
  deductions: {
    name: string;
    amount: number;
  }[];
  netPay: number;
  status: string;
  paidOn: string;
}

export async function generatePayslipPDF(
  data: PayslipData
): Promise<Uint8Array> {
  // Create a new PDF document
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.276, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Embed the font
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Set initial cursor position
  let y = height - 50;
  const margin = 50;
  const lineHeight = 20;

  // Helper function to draw text
  const drawText = (text: string, x: number, isBold = false) => {
    page.drawText(text, {
      x,
      y,
      size: 12,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  // Helper function to draw section header
  const drawSectionHeader = (text: string) => {
    y -= 10;
    page.drawText(text, {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;

    // Draw underline
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 10;
  };

  // Draw company header
  page.drawText("PAYROLL APP", {
    x: margin,
    y: height - 30,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Draw payslip title
  page.drawText(`Payslip for ${data.month}`, {
    x: margin,
    y: height - 60,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Employee Information
  drawSectionHeader("Employee Information");
  drawText(`Name: ${data.employeeName}`, margin, true);
  drawText(`Employee ID: ${data.employeeId}`, margin);
  drawText(`Department: ${data.department}`, margin);
  drawText(`Position: ${data.position}`, margin);

  // Earnings & Deductions
  drawSectionHeader("Earnings & Deductions");
  drawText(`Gross Pay: $${data.grossPay.toFixed(2)}`, margin, true);

  // Deductions
  y -= 10;
  drawText("Deductions:", margin);
  data.deductions.forEach((deduction) => {
    drawText(
      `${deduction.name}: -$${deduction.amount.toFixed(2)}`,
      margin + 20
    );
  });

  y -= 10;
  drawText(`Net Pay: $${data.netPay.toFixed(2)}`, margin, true);

  // Payment Information
  drawSectionHeader("Payment Information");
  drawText(
    `Payment Date: ${new Date(data.paidOn).toLocaleDateString()}`,
    margin
  );
  drawText("Payment Method: Direct Deposit", margin);

  // Footer
  const footerY = 50;
  page.drawText(
    "This is a computer-generated document and needs no signature.",
    {
      x: margin,
      y: footerY,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  // Add page numbers
  page.drawText("Page 1 of 1", {
    x: width - margin - 50,
    y: footerY,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Return the PDF as bytes
  return await doc.save();
}
