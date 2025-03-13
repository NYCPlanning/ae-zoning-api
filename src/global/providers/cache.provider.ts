import { LRUCache } from "lru-cache";
import { FactoryProvider } from "@nestjs/common";

export type Cache = {
  set: (key: string, value: string | number) => void;
  get: (key: string) => null | string;
};

export const CACHE = Symbol("CACHE_SERVICE");

export const CacheProvider: FactoryProvider<Cache> = {
  provide: CACHE,
  useFactory: () => {
    // time to live is in milliseconds
    const cache = new LRUCache({ max: 500, ttl: 2.16e7 });
    return {
      set: (key: string, value: string | number) =>
        // Coerce to string to emulate redis
        cache.set(key, value.toString()),
      get: (key: string) => {
        const result = cache.get(key);
        // Override returning undefined for empty cache
        // to emulate redis behavior
        console.info("result", result);
        if (result !== undefined && typeof result !== "string")
          throw new Error("cache only supports type string");
        return result === undefined ? null : result;
      },
    };
  },
};
