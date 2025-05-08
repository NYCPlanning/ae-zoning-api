import { FactoryProvider } from "@nestjs/common";
import { CacheableMemory, Keyv } from "cacheable";
import { createCache, Cache } from "cache-manager";

export type CacheService = {
  api: Cache;
  tile: Cache;
};

export const CACHE = Symbol("CACHE_SERVICE");

export const TileCacheProvider: FactoryProvider<CacheService> = {
  provide: CACHE,
  useFactory: () => {
    const api = createCache({
      stores: [
        new Keyv({
          namespace: "api",
          store: new CacheableMemory({
            ttl: "6h",
          }),
        }),
      ],
    });
    const tile = createCache({
      stores: [
        new Keyv({
          namespace: "tile",
          store: new CacheableMemory({
            lruSize: 2000,
            ttl: "6h",
          }),
        }),
      ],
    });
    return { api, tile };
  },
};
