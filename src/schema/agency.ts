import { sql } from "drizzle-orm";
import { check, pgTable, text } from "drizzle-orm/pg-core";
import { oversightLevelCategorySchema } from "src/gen";
import { z } from "zod";

export const agency = pgTable(
  "agency",
  {
    initials: text("initials").primaryKey(),
    name: text("name").notNull(),
    oversightLevel: text("oversight_level"),
  },
  (table) => [
    check(
      "agency_oversight_level",
      sql`${table.oversightLevel} IS NULL
      OR ${table.oversightLevel} IN ('City', 'County', 'State', 'Federal')`,
    ),
  ],
);

export const agencyEntitySchema = z.object({
  initials: z.string(),
  name: z.string(),
  oversightLevel: oversightLevelCategorySchema,
});

export type AgencyEntitySchema = z.infer<typeof agencyEntitySchema>;
