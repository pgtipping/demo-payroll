import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // MVP: Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Important for cookies
      });

      if (response.ok) {
        const { data } = await response.json();
        setState((prev) => ({ ...prev, user: data.user, isLoading: false }));
      } else {
        setState((prev) => ({ ...prev, user: null, isLoading: false }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        error: "Failed to check authentication status",
      }));
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        setState((prev) => ({
          ...prev,
          user: data.data.user,
          isLoading: false,
        }));
        router.push("/dashboard");
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Login failed",
        }));
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setState((prev) => ({ ...prev, user: null, isLoading: false }));
      router.push("/login");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Logout failed",
      }));
    }
  }, [router]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    checkAuth,
  };
}
