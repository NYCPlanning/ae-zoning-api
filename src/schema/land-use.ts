import { char, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const landUse = pgTable("land_use", {
  id: char("id", { length: 2 }).primaryKey(),
  description: text("description").notNull(),
  color: char("color", { length: 9 }).notNull(),
});

export const landUseEntitySchema = z.object({
  id: z.string().length(2),
  description: z.string(),
  color: z.string().regex(/^#([A-Fa-f0-9]{8})$/),
});

export type LandUseEntity = z.infer<typeof landUseEntitySchema>;
