import { char, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const borough = pgTable("borough", {
  id: char("id", { length: 1 }).primaryKey(),
  title: text("title").notNull(),
  abbr: text("abbr").notNull(),
});

export const boroughIdEntitySchema = z.string().regex(/^[1-9]$/);

export const boroughEntitySchema = z.object({
  id: boroughIdEntitySchema,
  title: z.string(),
  abbr: z.string().length(2),
});

export type BoroughEntity = z.infer<typeof boroughEntitySchema>;
