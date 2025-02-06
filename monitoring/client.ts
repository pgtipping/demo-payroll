import { onCLS, onFID, onLCP, onTTFB } from "web-vitals";

function sendToAnalytics(metric: any) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  };

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  const url = "/api/analytics";
  (navigator.sendBeacon && navigator.sendBeacon(url, JSON.stringify(body))) ||
    fetch(url, { body: JSON.stringify(body), method: "POST", keepalive: true });
}

export function initClientMonitoring() {
  try {
    // Core Web Vitals
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    // Custom performance marks
    if (performance && performance.mark) {
      performance.mark("app-init");
    }
  } catch (error) {
    console.error("Error initializing client monitoring:", error);
  }
}
