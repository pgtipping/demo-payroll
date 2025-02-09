// MVP: Core API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// API Error
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// MVP: Base API fetch function with error handling and cookie-based auth
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // For cookie-based auth
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    // Handle binary data (PDF) responses
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/pdf")) {
      const data = await response.arrayBuffer();
      return { data: data as T };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }
}

// MVP: Basic authentication API endpoints
export const authApi = {
  // MVP: Simple email/password login
  login: (email: string, password: string) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // MVP: Basic logout functionality
  logout: () => fetchApi("/auth/logout", { method: "POST" }),

  // MVP: User profile retrieval
  getProfile: () => fetchApi("/auth/profile"),
};

// MVP: Core employee data types
export interface ApiProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// MVP: Essential employee information
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "employee";
  status: "active" | "inactive";
  phone?: string;
  address?: string;
  createdAt: string;
}

// MVP: Employee self-service API endpoints
export const employeeApi = {
  // MVP: Basic profile management
  getProfile: () => fetchApi<ApiProfileResponse>("/employee/profile"),

  // MVP: Essential profile updates
  updateProfile: (data: ApiProfileResponse) =>
    fetchApi<ApiProfileResponse>("/employee/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // MVP: Basic password management
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<{ message: string }>("/employee/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// MVP: Payslip data types
export interface PayslipDownloadResponse {
  data: ArrayBuffer;
}

// MVP: Payslip management API
export const payslipApi = {
  // MVP: Basic payslip listing
  getPayslips: () => fetchApi("/payslips"),

  // MVP: Individual payslip retrieval
  getPayslip: (id: string) => fetchApi(`/payslips/${id}`),

  // MVP: Basic PDF download
  downloadPayslip: (id: string) =>
    fetchApi<ArrayBuffer>(`/payslips/${id}/download`, {
      headers: { Accept: "application/pdf" },
    }),

  // MVP: Batch download functionality
  downloadBatch: (ids: string[]) =>
    fetchApi<ArrayBuffer>("/payslips/batch", {
      method: "POST",
      body: JSON.stringify({ ids }),
      headers: { Accept: "application/zip" },
    }),
};

// MVP: Admin management API
export const adminApi = {
  // MVP: Basic employee listing
  getEmployees: () => fetchApi<Employee[]>("/admin/employees"),

  // MVP: Essential employee creation
  createEmployee: (data: Omit<Employee, "id" | "createdAt">) =>
    fetchApi<Employee>("/admin/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // MVP: Basic employee updates
  updateEmployee: (
    id: string,
    data: Partial<Omit<Employee, "id" | "createdAt">>
  ) =>
    fetchApi<Employee>(`/admin/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // MVP: Employee removal functionality
  deleteEmployee: (id: string) =>
    fetchApi<{ message: string }>(`/admin/employees/${id}`, {
      method: "DELETE",
    }),

  // MVP: Basic payroll processing
  processPayroll: (month: string, year: number) =>
    fetchApi<{ message: string }>("/admin/payroll/process", {
      method: "POST",
      body: JSON.stringify({ month, year }),
    }),
};
