import React from "react";
import { render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/theme-provider";
import { FeatureFlagProvider } from "@/lib/providers/feature-flags";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { FinancialProvider } from "@/contexts/FinancialContext";

// Custom render function that includes providers
function render(ui: React.ReactElement, { ...options } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider>
        <FeatureFlagProvider>
          <AuthProvider>
            <FinancialProvider>{children}</FinancialProvider>
          </AuthProvider>
        </FeatureFlagProvider>
      </ThemeProvider>
    );
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...options }),
    user: userEvent.setup(),
  };
}

// Helper to test accessibility
async function testAccessibility(ui: React.ReactElement) {
  const { container } = render(ui);
  const axe = require("jest-axe");
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

// Mock feature flags for testing
const mockFeatureFlags = {
  basicAuth: true,
  employeeDashboard: true,
  payslipView: true,
  profileManagement: true,
  adminPanel: true,
};

// Mock auth user for testing
const mockAuthUser = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "employee",
};

// Re-export everything
export * from "@testing-library/react";
export { render, testAccessibility, mockFeatureFlags, mockAuthUser };
export { default as userEvent } from "@testing-library/user-event";
