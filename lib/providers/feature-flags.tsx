"use client";

import { ReactNode } from "react";
import {
  FeatureFlagContext,
  FEATURES,
  type FeatureFlag,
} from "../config/features";

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const value = {
    features: FEATURES,
    isEnabled: (feature: FeatureFlag) => FEATURES[feature]?.enabled ?? false,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
