"use client";

import { createContext, useContext } from "react";

export type FeatureFlag =
  | "payslipView"
  | "employeeManagement"
  | "payrollProcessing"
  | "onDemandPay"
  | "wellnessProgram";

interface Feature {
  enabled: boolean;
  description: string;
}

export const FEATURES: Record<FeatureFlag, Feature> = {
  payslipView: {
    enabled: true,
    description: "Basic payslip viewing functionality",
  },
  employeeManagement: {
    enabled: true,
    description: "Core employee management functionality",
  },
  payrollProcessing: {
    enabled: true,
    description: "Basic payroll processing capabilities",
  },
  onDemandPay: {
    enabled: false,
    description: "On-demand pay access (advanced feature)",
  },
  wellnessProgram: {
    enabled: false,
    description: "Employee wellness program (advanced feature)",
  },
};

interface FeaturesContextType {
  features: typeof FEATURES;
  isEnabled: (feature: FeatureFlag) => boolean;
}

export const FeatureFlagContext = createContext<FeaturesContextType>({
  features: FEATURES,
  isEnabled: () => false,
});

export const useFeatures = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureFlagProvider");
  }
  return context;
};
