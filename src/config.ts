import { registerAs } from "@nestjs/config";

// Drizzle configuration for application
export const DbConfig = registerAs("db", () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
}));

export const FeatureFlagConfig = registerAs("featureFlag", () => ({}));

export const StorageConfig = registerAs("storage", () => ({
  storageUrl: process.env.STORAGE_URL,
}));
