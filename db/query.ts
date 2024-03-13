import { pgClient } from "./pg-client";
import * as fs from "fs";
import { exit } from "process";

(async () => {
  const fileName = process.argv[2];
  const sql = fs.readFileSync(`db/query/${fileName}.sql`).toString();

  await pgClient.connect();

  console.info(`starting query: ${fileName}`);
  const startTime = performance.now();
  const queryIntervalId = setInterval(() => {
    process.stdout.cursorTo(0);
    process.stdout.write(
      `seconds elapsed: ${Math.round((performance.now() - startTime) / 1e3)}`,
    );
  }, 1000);

  await pgClient.query(sql);
  await pgClient.end();

  clearInterval(queryIntervalId);
  console.info("\nquery complete");
  exit();
})();
