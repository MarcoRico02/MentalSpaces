// App Configuration - Centralized configuration
// App Configuration - Centralized configuration
export const appConfig = {
  api: {
    baseUrl: "/api",
    timeout: 10000,
  },
  auth: {
    sessionTimeout: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 1,
  },
  app: {
    name: "SATI",
    description: "Mental Health Consultation Center",
    version: "1.0.0",
  },
};

// Environment Variables
export const envVars = {
  apiBaseUrl: import.meta.env?.VITE_API_BASE_URL || "/api",
  isDevelopment: import.meta.env?.DEV || false,
  isProduction: import.meta.env?.PROD || false,
  debug: import.meta.env?.DEV || false,
};
