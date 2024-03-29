import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";
import { RavenProvider } from "./providers/raven.provider";

@Global()
@Module({
  providers: [DbProvider, RavenProvider],
  exports: [DB],
})
export class GlobalModule {}
