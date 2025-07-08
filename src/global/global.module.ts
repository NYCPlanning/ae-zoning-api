import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";
import { TILE_CACHE, TileCacheProvider } from "./providers/tile-cache.provider";
import {
  FILE_STORAGE,
  FileStorageProvider,
} from "./providers/file-storage.provider";

@Global()
@Module({
  providers: [DbProvider, FileStorageProvider, TileCacheProvider],
  exports: [DB, FILE_STORAGE, TILE_CACHE],
})
export class GlobalModule {}
