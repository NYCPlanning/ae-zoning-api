import { FactoryProvider } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DbConfig } from "src/config";
import * as schema from "src/schema";

export type DbType = NodePgDatabase<typeof schema>;
export const DB = Symbol("DB_SERVICE");

export const DbProvider: FactoryProvider = {
  provide: DB,
  inject: [DbConfig.KEY],
  useFactory: (dbConfig: ConfigType<typeof DbConfig>) => {
    let sslConfig: any;
    // If unauthorized SSL connections shouldn't be rejected, don't use SSL connections
    if (dbConfig.sslRejectUnauthorized) {
      sslConfig = {
        rejectUnauthorized: dbConfig.sslRejectUnauthorized,
      };
    } else {
      sslConfig = false;
    }

    const pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.name,
      ssl: sslConfig,
    });

    return drizzle(pool, { schema });
  },
};
