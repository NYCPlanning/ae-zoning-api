import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { exit } from "process";
import { pgClientAdmin } from "./pg-client";

(async () => {
  console.info("start migrate");
  await pgClientAdmin.connect();
  const db = drizzle(pgClientAdmin);
  await migrate(db, { migrationsFolder: "./db/migration" });
  await pgClientAdmin.end();
  console.info("end migrate");
  exit();
})();
