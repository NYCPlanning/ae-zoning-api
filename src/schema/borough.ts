import { char, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const borough = pgTable("borough", {
  id: char("id", { length: 1 }).primaryKey(),
  title: text("title").notNull(),
  abbr: text("abbr").notNull(),
});

export const selectBoroughSchema = createSelectSchema(borough);

export type SelectBorough = z.infer<typeof selectBoroughSchema>;
