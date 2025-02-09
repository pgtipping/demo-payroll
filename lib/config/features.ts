"use client";

import { createContext, useContext } from "react";

export type FeatureFlag =
  | "payslipView"
  | "employeeManagement"
  | "payrollProcessing"
  | "onDemandPay"
  | "wellnessProgram";

interface FeaturesContextType {
  isEnabled: (feature: FeatureFlag) => boolean;
}

// MVP features that are enabled by default
const MVP_FEATURES: Record<FeatureFlag, boolean> = {
  payslipView: true,
  employeeManagement: true,
  payrollProcessing: true,
  onDemandPay: false,
  wellnessProgram: false,
};

export const FeaturesContext = createContext<FeaturesContextType>({
  isEnabled: () => false,
});

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return context;
};

export const createFeaturesProvider = () => {
  return {
    isEnabled: (feature: FeatureFlag) => MVP_FEATURES[feature] ?? false,
  };
};
