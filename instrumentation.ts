export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Register server instrumentation
    require("./monitoring/server");
  } else {
    // Register client instrumentation
    require("./monitoring/client");
  }
}

// Initialize analytics
export function onInit() {
  // Initialize performance monitoring
  if (typeof window !== "undefined") {
    // Report Web Vitals
    import("web-vitals").then(({ onCLS, onFID, onLCP }) => {
      onCLS(console.log);
      onFID(console.log);
      onLCP(console.log);
    });
  }
}
