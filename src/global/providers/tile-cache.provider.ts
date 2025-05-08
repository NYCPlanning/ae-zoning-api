import { FactoryProvider } from "@nestjs/common";
import { CacheableMemory } from "cacheable";

export const TILE_CACHE = Symbol("TILE_CACHE");
export const TileCacheProvider: FactoryProvider<CacheableMemory> = {
  provide: TILE_CACHE,
  useFactory: () => {
    const cacheable = new CacheableMemory({
      lruSize: 2000,
      ttl: "6h",
    });
    return cacheable;
  },
};
