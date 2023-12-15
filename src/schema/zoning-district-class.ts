import { char, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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

export const selectZoningDistrictClassSchema =
  createSelectSchema(zoningDistrictClass);

export type SelectZoningDistrictClass = z.infer<
  typeof selectZoningDistrictClassSchema
>;
