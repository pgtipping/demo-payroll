"use client";

import { createContext, useContext } from "react";

export type FeatureFlag = {
  enabled: boolean;
  isAdvanced: boolean;
  description: string;
};

export type FeatureFlags = {
  [key: string]: FeatureFlag;
};

// Core MVP Features (always enabled)
const MVP_FEATURES = {
  basicAuth: {
    enabled: true,
    isAdvanced: false,
    description: "Basic cookie-based authentication",
  },
  employeeManagement: {
    enabled: true,
    isAdvanced: false,
    description: "Basic employee CRUD operations",
  },
  payrollProcessing: {
    enabled: true,
    isAdvanced: false,
    description: "Basic payroll calculation and PDF generation",
  },
  employeeSelfService: {
    enabled: true,
    isAdvanced: false,
    description: "Basic employee profile viewing and updates",
  },
  payslipView: {
    enabled: true,
    isAdvanced: false,
    description: "View and download payslips",
  },
  profileManagement: {
    enabled: true,
    isAdvanced: false,
    description: "Basic profile and settings management",
  },
};

// Export only MVP features during MVP phase
export const FEATURES: FeatureFlags = MVP_FEATURES;

// Environment-based configuration
export const isProduction = process.env.NODE_ENV === "production";
export const isMVPMode =
  process.env.NEXT_PUBLIC_MVP_MODE === "true" || isProduction;

// Helper functions
export const isFeatureEnabled = (
  featureKey: keyof typeof FEATURES
): boolean => {
  const feature = FEATURES[featureKey];
  if (!feature) return false;

  // MVP features are always enabled
  if (!feature.isAdvanced) return true;

  // In MVP mode, advanced features are disabled
  if (isMVPMode) return false;

  return feature.enabled;
};

export const FeatureFlagContext = createContext<{
  features: FeatureFlags;
  isEnabled: (feature: keyof FeatureFlags) => boolean;
}>({
  features: FEATURES,
  isEnabled: (feature) => FEATURES[feature]?.enabled ?? false,
});

export const useFeatures = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureFlagProvider");
  }
  return context;
};
