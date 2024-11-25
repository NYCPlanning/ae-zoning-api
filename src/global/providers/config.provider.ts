import { FactoryProvider } from "@nestjs/common";
import { createClient } from "@redis/client";

export type RedisCacheClient = ReturnType<typeof createClient>;
export const CACHE = Symbol("CACHE_CONNECTION");

export const CacheProvider: FactoryProvider = {
  provide: CACHE,
  useFactory: async () =>
    await createClient()
      .on("error", (err) => console.error("Redis client error", err))
      .connect(),
};
