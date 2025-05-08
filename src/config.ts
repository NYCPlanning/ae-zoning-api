import { registerAs } from "@nestjs/config";
import { z } from "zod";
// Drizzle configuration for application
export const DbConfig = registerAs("db", () => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  env: process.env.DATABASE_ENV,
}));

export const TileCacheConfig = registerAs("tileCache", () => {
  const lruSize = z.coerce
    .number({
      required_error: "TILE_CACHE_LRU_SIZE environment variable is required",
      invalid_type_error: "TILE_CACHE_LRU_SIZE must be an integer",
    })
    .int()
    .parse(process.env.TILE_CACHE_LRU_SIZE);
  return {
    lruSize: lruSize,
  };
});

export const FeatureFlagConfig = registerAs("featureFlag", () => ({}));

export const StorageConfig = registerAs("storage", () => ({
  storageUrl: process.env.STORAGE_URL,
}));
