import "dotenv/config";
import { exit } from "process";
import { pgClientAdminDefaultDB } from "./pg-client";

(async () => {
  console.info(
    "start create database " +
      process.env.DATABASE_NAME +
      " for user " +
      process.env.DATABASE_USER,
  );
  const queryCreate = 'CREATE DATABASE "' + process.env.DATABASE_NAME + '";';
  const queryOwner =
    'ALTER DATABASE "' +
    process.env.DATABASE_NAME +
    '" OWNER TO ' +
    process.env.DATABASE_USER +
    ";";

  await pgClientAdminDefaultDB.connect();
  await pgClientAdminDefaultDB.query(queryCreate);
  await pgClientAdminDefaultDB.query(queryOwner);
  await pgClientAdminDefaultDB.end();
  console.info("end create database");
  exit();
})();
