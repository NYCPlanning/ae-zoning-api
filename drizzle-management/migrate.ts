import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { exit } from "process";
import { pgClient } from "./pg-client";

(async () => {
  console.info("start migrate");
  await pgClient.connect();
  const db = drizzle(pgClient);
  await migrate(db, { migrationsFolder: "./drizzle-management/migration" });
  await pgClient.end();
  console.info("end migrate");
  exit();
})();
