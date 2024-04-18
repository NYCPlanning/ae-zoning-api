import { Global, Module } from "@nestjs/common";
import { DB, DbProvider } from "src/global/providers/db.provider";
import { SentryProvider } from "./providers/sentry-provider";

@Global()
@Module({
  providers: [DbProvider, SentryProvider],
  exports: [DB],
})
export class GlobalModule {}
