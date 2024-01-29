import { char, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
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

export const zoningDistrictClassCategoryEntitySchema = z.enum([
  "Residential",
  "Commercial",
  "Manufacturing",
]);

export type ZoningDistrictClassCategoryEntity = z.infer<
  typeof zoningDistrictClassCategoryEntitySchema
>;

export const zoningDistrictClassEntitySchema = z.object({
  id: z.string().regex(new RegExp("^[A-Z][0-9]+$")),
  category: zoningDistrictClassCategoryEntitySchema.nullable(),
  description: z.string().describe(`Zoning class descriptions.`),
  url: z.string().nullable(),
  color: z.string().regex(new RegExp("^#([A-Fa-f0-9]{8})$")),
});
