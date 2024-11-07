import { Client } from "pg";
import "dotenv/config";

export const pgClient = new Client({
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME!,
  ssl: process.env.DATABASE_ENV !== "development" && {
    rejectUnauthorized: false,
  },
});
