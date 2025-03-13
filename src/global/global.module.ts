import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";
import { CACHE, CacheProvider } from "./providers/cache.provider";

@Global()
@Module({
  providers: [DbProvider, CacheProvider],
  exports: [DB, CACHE],
})
export class GlobalModule {}
