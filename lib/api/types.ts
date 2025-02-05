/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Employee types
 */
export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  salary: number;
  payGrade?: PayGrade;
  createdAt: string;
  updatedAt: string;
}

export interface PayGrade {
  id: string;
  name: string;
  description?: string;
  minSalary: number;
  maxSalary?: number;
}

/**
 * Payroll types
 */
export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  grossPay: number;
  netPay: number;
  deductions: number;
  status: PayrollStatus;
  processedAt?: string;
  components: PayrollComponent[];
}

export interface PayrollComponent {
  type: string;
  amount: number;
  description?: string;
}

export enum PayrollStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

/**
 * Tax types
 */
export interface TaxBracket {
  id: string;
  minIncome: number;
  maxIncome?: number;
  rate: number;
  description?: string;
  payGradeId?: string;
  startDate: string;
  endDate?: string;
}

/**
 * Deduction types
 */
export interface DeductionType {
  id: string;
  name: string;
  description?: string;
  isRecurring: boolean;
}

export interface DeductionEntry {
  id: string;
  deductionType: DeductionType;
  amount: number;
  startDate: string;
  endDate?: string;
}

/**
 * Request types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateEmployeeRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  salary: number;
  role?: string;
  payGradeId?: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  salary?: number;
  payGradeId?: string;
}

export interface RunPayrollRequest {
  month: number;
  year: number;
  employeeIds?: string[];
}

export interface CreateDeductionRequest {
  deductionTypeId: string;
  amount: number;
  startDate: string;
  endDate?: string;
}
