import { char, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const borough = pgTable("borough", {
  id: char("id", { length: 1 }).primaryKey(),
  title: text("title").notNull(),
  abbr: text("abbr").notNull(),
});

export const boroughSchema = z.object({
  id: z.string().regex(new RegExp("\\b[1-9]\\b")),
  title: z.string(),
  abbr: z.string().length(2),
});

export type Borough = z.infer<typeof boroughSchema>;
