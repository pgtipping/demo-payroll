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

// Base fetch function with error handling
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

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => fetchApi("/auth/logout", { method: "POST" }),

  getProfile: () => fetchApi("/auth/profile"),
};

// API Response Types
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

// Employee Types
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

// Employee API
export const employeeApi = {
  getProfile: () => fetchApi<ApiProfileResponse>("/employee/profile"),

  updateProfile: (data: ApiProfileResponse) =>
    fetchApi<ApiProfileResponse>("/employee/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<{ message: string }>("/employee/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// Update Payslip API types and implementation
export interface PayslipDownloadResponse {
  data: ArrayBuffer;
}

// Payslip API
export const payslipApi = {
  getPayslips: () => fetchApi("/payslips"),

  getPayslip: (id: string) => fetchApi(`/payslips/${id}`),

  downloadPayslip: (id: string) =>
    fetchApi<ArrayBuffer>(`/payslips/${id}/download`, {
      headers: { Accept: "application/pdf" },
    }),

  downloadBatch: (ids: string[]) =>
    fetchApi<ArrayBuffer>("/payslips/batch", {
      method: "POST",
      body: JSON.stringify({ ids }),
      headers: { Accept: "application/zip" },
    }),
};

// Admin API
export const adminApi = {
  getEmployees: () => fetchApi<Employee[]>("/admin/employees"),

  createEmployee: (data: Omit<Employee, "id" | "createdAt">) =>
    fetchApi<Employee>("/admin/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEmployee: (
    id: string,
    data: Partial<Omit<Employee, "id" | "createdAt">>
  ) =>
    fetchApi<Employee>(`/admin/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEmployee: (id: string) =>
    fetchApi<{ message: string }>(`/admin/employees/${id}`, {
      method: "DELETE",
    }),

  processPayroll: (month: string, year: number) =>
    fetchApi<{ message: string }>("/admin/payroll/process", {
      method: "POST",
      body: JSON.stringify({ month, year }),
    }),
};
