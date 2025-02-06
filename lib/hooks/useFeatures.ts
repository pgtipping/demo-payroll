import { useCallback } from "react";
import { FEATURES, isFeatureEnabled } from "../config/features";

export function useFeatures() {
  const checkFeature = useCallback(
    (featureKey: keyof typeof FEATURES): boolean => {
      return isFeatureEnabled(featureKey);
    },
    []
  );

  return {
    isEnabled: checkFeature,
    features: FEATURES,
  };
}
