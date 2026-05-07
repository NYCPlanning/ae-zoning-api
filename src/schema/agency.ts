import { sql } from "drizzle-orm";
import { check, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { oversightLevelCategorySchema } from "src/gen";
import { z } from "zod";

export const oversightLevelEnum = pgEnum("oversight_level_enum", [
  "City",
  "County",
  "State",
  "Federal",
]);

export const agency = pgTable(
  "agency",
  {
    initials: text("initials").primaryKey(),
    name: text("name").notNull(),
    oversightLevel: oversightLevelEnum("oversight_level"),
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
