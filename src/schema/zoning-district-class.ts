import { char, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "Residential",
  "Commercial",
  "Manufacturing",
]);

export const zoningDistrictClass = pgTable("zoning_district_class", {
  id: text("id").primaryKey(),
  category: categoryEnum("category"),
  description: text("description").notNull(),
  url: text("url"),
  color: char("color", { length: 9 }).notNull(),
});
