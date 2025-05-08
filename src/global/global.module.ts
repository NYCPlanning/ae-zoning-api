import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";
import { TILE_CACHE, TileCacheProvider } from "./providers/tile-cache.provider";

@Global()
@Module({
  providers: [DbProvider, TileCacheProvider],
  exports: [DB, TILE_CACHE],
})
export class GlobalModule {}
