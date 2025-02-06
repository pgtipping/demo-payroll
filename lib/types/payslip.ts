export interface PayslipData {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  deductions: {
    tax: number;
    healthInsurance: number;
    pension: number;
    other?: number;
  };
  netSalary: number;
  currency: string;
  status?: "paid" | "pending";
  paidOn?: string;
  generatedAt: string;
}

export interface BatchPayslipDownloadProps {
  payslips: PayslipData[];
  period: string;
}
