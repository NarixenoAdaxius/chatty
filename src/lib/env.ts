import { z } from "zod";

// Client-side environment variables (accessible in browser)
const clientEnvSchema = z.object({
  // Core Application
  NEXT_PUBLIC_APP_NAME: z.string().default("Chatty"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // Clerk Authentication (Client)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  
  // Clerk URLs
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default("/chat"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default("/chat"),
  
  // Convex Database (Client)
  NEXT_PUBLIC_CONVEX_URL: z.string().url("Convex URL must be a valid URL"),
  
  // Optional Services (Client)
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
});

// Server-side environment variables (only accessible on server)
const serverEnvSchema = z.object({
  // Core Application
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Clerk Authentication (Server)
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
  
  // Convex Database (Server)
  CONVEX_DEPLOY_KEY: z.string().min(1, "Convex deploy key is required"),
  
  // API Security
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  CORS_CREDENTIALS: z.string().transform(val => val === "true").default("true"),
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().min(1)).default("100"),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1)).default("900000"),
  
  // JWT Configuration
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  
  // Optional Services (Server)
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  GIPHY_API_KEY: z.string().optional(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
  
  // Development
  NEXT_TELEMETRY_DISABLED: z.string().transform(val => val === "1").default("1"),
  ANALYZE: z.string().transform(val => val === "true").default("false"),
});

// Combined schema for server-side usage
const fullEnvSchema = clientEnvSchema.merge(serverEnvSchema);

// Detect if we're running on the client side
const isClient = typeof window !== 'undefined';

// Parse and validate environment variables
const parseEnv = () => {
  if (isClient) {
    // Client-side: Return process.env directly with type assertion, no validation
    return process.env as z.infer<typeof fullEnvSchema>;
  }
  
  // Server-side: Validate all variables
  try {
    return fullEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      
      console.error("❌ Environment validation failed:");
      formattedErrors.forEach(error => console.error(`  - ${error}`));
      
      throw new Error(
        `Environment validation failed:\n${formattedErrors.join("\n")}`
      );
    }
    throw error;
  }
};

// Export validated environment variables
export const env = parseEnv();

// Type-safe environment variables
export type Env = z.infer<typeof fullEnvSchema>;

// Utility function to check if we're in development (server-only)
export const isDev = !isClient && 'NODE_ENV' in env && env.NODE_ENV === "development";
export const isProd = !isClient && 'NODE_ENV' in env && env.NODE_ENV === "production";
export const isTest = !isClient && 'NODE_ENV' in env && env.NODE_ENV === "test";

// Utility function to get the base URL
export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return env.NEXT_PUBLIC_APP_URL;
};

// Helper to validate environment on app startup
export const validateEnvironment = () => {
  try {
    parseEnv();
    console.log("✅ Environment validation passed");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};