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
  const { TILE_CACHE_LRU_SIZE } = process.env;
  const defaultLruSize = 2000;
  const lruSize =
    TILE_CACHE_LRU_SIZE === undefined
      ? defaultLruSize
      : z.coerce
          .number({
            invalid_type_error: "TILE_CACHE_LRU_SIZE must be an integer",
          })
          .int()
          .parse(TILE_CACHE_LRU_SIZE);
  return {
    lruSize,
  };
});

export const FeatureFlagConfig = registerAs("featureFlag", () => ({}));

export const StorageConfig = registerAs("storage", () => ({
  storageUrl: process.env.STORAGE_URL,
}));
