"use client";

import { ReactNode } from "react";
import { FeatureFlagContext, FEATURES } from "../config/features";

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const value = {
    features: FEATURES,
    isEnabled: (feature: keyof typeof FEATURES) =>
      FEATURES[feature]?.enabled ?? false,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
