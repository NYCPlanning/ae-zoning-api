import { pgTable, text } from "drizzle-orm/pg-core";
import { multiPolygonGeom, pointGeom } from "src/drizzle-pgis";
import { z } from "zod";

export const cityCouncilDistrict = pgTable("city_council_district", {
  id: text("id").primaryKey(),
  liFt: multiPolygonGeom("li_ft", 2263),
  mercatorFill: multiPolygonGeom("mercator_fill", 3857),
  mercatorLabel: pointGeom("mercator_label", 3857),
});

export const cityCouncilDistrictEntitySchema = z.object({
  id: z.string(),
});
