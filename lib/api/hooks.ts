import { useCallback, useEffect, useState } from "react";
import { apiClient } from "./client";
import type {
  ApiResponse,
  Employee,
  PayrollRun,
  TaxBracket,
  DeductionType,
  PaginationParams,
} from "./types";

/**
 * Generic hook for fetching paginated data
 */
export function usePagedData<T>(
  endpoint: string,
  params?: PaginationParams & Record<string, string>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<ApiResponse<T>["meta"]>();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<T[]>(endpoint, params);
      setData(response.data);
      setMeta(response.meta);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, meta, refetch: fetchData };
}

/**
 * Hook for employee data
 */
export function useEmployees(params?: PaginationParams) {
  return usePagedData<Employee>("/employees", params);
}

export function useEmployee(id: string) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Employee>(`/employees/${id}`);
      setEmployee(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading, error, refetch: fetchEmployee };
}

/**
 * Hook for payroll data
 */
export function usePayrollRuns(params?: PaginationParams) {
  return usePagedData<PayrollRun>("/payroll/runs", params);
}

export function usePayrollRun(id: string) {
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayrollRun = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<PayrollRun>(`/payroll/runs/${id}`);
      setPayrollRun(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayrollRun();
  }, [fetchPayrollRun]);

  return { payrollRun, loading, error, refetch: fetchPayrollRun };
}

/**
 * Hook for tax bracket data
 */
export function useTaxBrackets(params?: PaginationParams) {
  return usePagedData<TaxBracket>("/tax/brackets", params);
}

/**
 * Hook for deduction type data
 */
export function useDeductionTypes(params?: PaginationParams) {
  return usePagedData<DeductionType>("/payroll/deduction-types", params);
}

/**
 * Hook for authentication state
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<{ token: string }>("/auth/login", {
      email,
      password,
    });
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    apiClient.setAuthToken(newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    apiClient.clearAuthToken();
    setToken(null);
  }, []);

  useEffect(() => {
    if (token) {
      apiClient.setAuthToken(token);
    }
  }, [token]);

  return {
    isAuthenticated: !!token,
    token,
    login,
    logout,
  };
}
