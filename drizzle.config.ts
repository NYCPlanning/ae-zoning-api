// Drizzle kit configuration
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/*",
  dialect: "postgresql",
  out: "db/migration",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME!,
    ssl: process.env.NODE_ENV === "production" && {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
