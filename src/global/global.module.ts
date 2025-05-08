import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";
import { CACHE, TileCacheProvider } from "./providers/cache.provider";

@Global()
@Module({
  providers: [DbProvider, TileCacheProvider],
  exports: [DB, CACHE],
})
export class GlobalModule {}
