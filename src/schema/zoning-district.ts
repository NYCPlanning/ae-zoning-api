import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { multiPolygonGeog, multiPolygonGeom, pointGeom } from "../drizzle-pgis";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const zoningDistrict = pgTable("zoning_district", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  wgs84: multiPolygonGeog("wgs84", 4326).notNull(),
  liFt: multiPolygonGeom("li_ft", 2263).notNull(),
  mercatorFill: multiPolygonGeom("mercator_fill", 3857),
  mercatorLabel: pointGeom("mercator_label", 3857),
});

export const selectZoningDistrictSchema = createSelectSchema(zoningDistrict);

export type SelectZoningDistrict = z.infer<typeof selectZoningDistrictSchema>;
