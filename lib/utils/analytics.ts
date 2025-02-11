import { type Metric } from "web-vitals";

// Function to send metrics to your analytics service
export function reportWebVitals(metric: Metric) {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

  // TODO: Send to your analytics service
  // Example implementation:
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // You can send to your analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/vitals", body);
  } else {
    fetch("/api/analytics/vitals", {
      body,
      method: "POST",
      keepalive: true,
    });
  }
}

// Helper function to get rating text
export function getWebVitalRating(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  switch (name) {
    case "CLS":
      return value <= 0.1
        ? "good"
        : value <= 0.25
        ? "needs-improvement"
        : "poor";
    case "FID":
      return value <= 100
        ? "good"
        : value <= 300
        ? "needs-improvement"
        : "poor";
    case "LCP":
      return value <= 2500
        ? "good"
        : value <= 4000
        ? "needs-improvement"
        : "poor";
    case "FCP":
      return value <= 1800
        ? "good"
        : value <= 3000
        ? "needs-improvement"
        : "poor";
    case "TTFB":
      return value <= 800
        ? "good"
        : value <= 1800
        ? "needs-improvement"
        : "poor";
    case "INP":
      return value <= 200
        ? "good"
        : value <= 500
        ? "needs-improvement"
        : "poor";
    default:
      return "needs-improvement";
  }
}

// Types for performance metrics
export interface PerformanceMetrics {
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  LCP?: number; // Largest Contentful Paint
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

// Function to format metric values for display
export function formatMetricValue(name: string, value: number): string {
  switch (name) {
    case "CLS":
      return value.toFixed(3);
    case "FID":
    case "LCP":
    case "FCP":
    case "TTFB":
    case "INP":
      return `${Math.round(value)}ms`;
    default:
      return value.toString();
  }
}
