import { InferSelectModel } from "drizzle-orm";
import { char, pgTable, text } from "drizzle-orm/pg-core";

export const landUse = pgTable("land_use", {
  id: char("id", { length: 2 }).primaryKey(),
  description: text("description").notNull(),
  color: char("color", { length: 9 }).notNull(),
});

export type SelectLandUse = InferSelectModel<typeof landUse>;
