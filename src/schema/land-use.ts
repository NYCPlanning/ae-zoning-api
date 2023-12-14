import { char, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const landUse = pgTable("land_use", {
  id: char("id", { length: 2 }).primaryKey(),
  description: text("description").notNull(),
  color: char("color", { length: 9 }).notNull(),
});

export const selectLandUseSchema = createSelectSchema(landUse);

export type SelectLandUse = z.infer<typeof selectLandUseSchema>;
