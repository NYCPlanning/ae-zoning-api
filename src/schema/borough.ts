import { char, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const borough = pgTable("borough", {
  id: char("id", { length: 1 }).primaryKey(),
  title: text("title").notNull(),
  abbr: text("abbr").notNull(),
});

export const boroughEntitySchema = z.object({
  id: z.string().regex(/^[0-9]$/),
  title: z.string(),
  abbr: z.string().length(2),
});

export type BoroughEntity = z.infer<typeof boroughEntitySchema>;
