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
};

// Advanced Features (toggleable)
const ADVANCED_FEATURES = {
  oauth: {
    enabled: false,
    isAdvanced: true,
    description: "OAuth-based authentication",
  },
  redis: {
    enabled: false,
    isAdvanced: true,
    description: "Redis caching layer",
  },
  advancedPayroll: {
    enabled: false,
    isAdvanced: true,
    description: "Advanced payroll features including custom deductions",
  },
  wellnessProgram: {
    enabled: false,
    isAdvanced: true,
    description: "Wellness program integration",
  },
  onDemandPay: {
    enabled: false,
    isAdvanced: true,
    description: "On-demand pay feature",
  },
  financialTools: {
    enabled: false,
    isAdvanced: true,
    description: "Advanced financial tools and analytics",
  },
};

export const FEATURES: FeatureFlags = {
  ...MVP_FEATURES,
  ...ADVANCED_FEATURES,
};

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
