export function initServerMonitoring() {
  try {
    // Server-side performance monitoring
    if (process.env.NODE_ENV === "production") {
      // Initialize server monitoring
      const startTime = process.hrtime();

      // Monitor memory usage
      const used = process.memoryUsage();
      const metrics = {
        memory: {
          rss: `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`,
          heapTotal: `${
            Math.round((used.heapTotal / 1024 / 1024) * 100) / 100
          } MB`,
          heapUsed: `${
            Math.round((used.heapUsed / 1024 / 1024) * 100) / 100
          } MB`,
          external: `${
            Math.round((used.external / 1024 / 1024) * 100) / 100
          } MB`,
        },
        uptime: process.uptime(),
      };

      // Log metrics (replace with your preferred logging solution)
      console.log("Server Metrics:", metrics);
    }
  } catch (error) {
    console.error("Error initializing server monitoring:", error);
  }
}
