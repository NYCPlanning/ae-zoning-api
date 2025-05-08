import { FactoryProvider } from "@nestjs/common";
import { CacheableMemory, Keyv } from "cacheable";
import { createCache, Cache } from "cache-manager";
import { TileCacheConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

export type TileCacheService = Cache;

/*
  Tiles have a separate cache from the default/api cache because they behave differently from api requests.
  There are more tile requests and each one takes more memory to store.
  Tile storage needs to be limited to avoid running out of application memory.
  This limit should not affect the API requests (like counts and validations) because the api requests take much less memory.
*/
export const TILE_CACHE = Symbol("TILE_CACHE");
export const TileCacheProvider: FactoryProvider<TileCacheService> = {
  provide: TILE_CACHE,
  inject: [TileCacheConfig.KEY],
  useFactory: (tileCacheConfig: ConfigType<typeof TileCacheConfig>) => {
    return createCache({
      stores: [
        new Keyv({
          namespace: "tile",
          store: new CacheableMemory({
            lruSize: tileCacheConfig.lruSize,
            ttl: "6h",
          }),
        }),
      ],
    });
  },
};
