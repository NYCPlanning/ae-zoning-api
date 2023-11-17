import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";

@Global()
@Module({
  providers: [DbProvider],
  exports: [DB],
})
export class GlobalModule {}
