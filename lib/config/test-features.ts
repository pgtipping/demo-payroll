// Test file to trigger pre-commit hook
export const TEST_FEATURES = {
  advancedPayroll: {
    enabled: true, // This should trigger the hook
    isAdvanced: true,
    description: "Advanced payroll features including custom deductions",
  },
  wellnessProgram: {
    enabled: true, // This should also trigger the hook
    isAdvanced: true,
    description: "Wellness program integration",
  },
};
