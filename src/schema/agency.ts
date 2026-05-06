import { pgTable, text, check } from "drizzle-orm/pg-core";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { agencyOversightLevelSchema } from "src/gen";

export const agency = pgTable(
  "agency",
  {
    initials: text("initials").primaryKey(),
    name: text("name").notNull(),
    oversightLevel: text("oversight_level"),
  },
  (table) => [
    check(
      "agency_oversight_level_options",
      sql`${table.oversightLevel} IN (
          'Federal',
          'State',
          'County',
          'City'
          )`,
    ),
  ],
);

export const agencyEntitySchema = z.object({
  initials: z.string(),
  name: z.string(),
  oversightLevel: agencyOversightLevelSchema,
});

export type AgencyEntitySchema = z.infer<typeof agencyEntitySchema>;
