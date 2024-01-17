import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { multiPolygonGeog, multiPolygonGeom } from "../drizzle-pgis";
import { z } from "zod";

export const zoningDistrict = pgTable("zoning_district", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  wgs84: multiPolygonGeog("wgs84", 4326).notNull(),
  liFt: multiPolygonGeom("li_ft", 2263).notNull(),
});

export const zoningDistrictEntitySchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
});

export type ZoningDistrictEntitySchema = z.infer<
  typeof zoningDistrictEntitySchema
>;
