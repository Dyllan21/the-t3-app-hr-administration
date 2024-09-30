// Import environment variables for validation
if (!process.env.SKIP_ENV_VALIDATION) {
  await import("./src/env.js");
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Add any Next.js configuration options here
  reactStrictMode: true,

  // Ensure environment variables are available
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_ANON_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },

  // Enable future webpack or build optimizations
  experimental: {
    // Add specific features you want enabled here
  },

  // Additional configuration (e.g., for Docker, Vercel, etc.)
  ...(process.env.SKIP_ENV_VALIDATION && {
    webpack: (config, {}) => {
      // Ignore certain modules for Docker build optimization if needed
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return config;
    },
  }),
};

export default nextConfig;
