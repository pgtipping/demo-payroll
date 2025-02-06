"use client";

import { ReactNode } from "react";
import { FeatureFlagContext, FEATURES } from "../config/features";

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagContext.Provider value={FEATURES}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
