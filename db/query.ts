import { pgClient } from "./pg-client";
import * as fs from "fs";
import { exit } from "process";

(async () => {
  const fileName = process.argv[2];
  const sql = fs.readFileSync(`db/query/${fileName}.sql`).toString();
  await pgClient.connect();
  await pgClient.query(sql);
  await pgClient.end();
  exit();
})();
