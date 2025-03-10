import { index, pgTable, text } from "drizzle-orm/pg-core";
import { multiPolygonGeom, pointGeom } from "src/drizzle-pgis";
import { z } from "zod";

export const cityCouncilDistrict = pgTable(
  "city_council_district",
  {
    id: text("id").primaryKey(),
    liFt: multiPolygonGeom("li_ft", 2263),
    mercatorFill: multiPolygonGeom("mercator_fill", 3857),
    mercatorLabel: pointGeom("mercator_label", 3857),
  },
  (table) => [
    index().using("GIST", table.mercatorFill),
    index().using("GIST", table.mercatorLabel),
    index().using("GIST", table.liFt),
  ],
);

export const cityCouncilDistrictEntitySchema = z.object({
  id: z.string().regex(new RegExp("^([0-9]{1,2})$")),
});

export type CityCouncilDistrictEntity = z.infer<
  typeof cityCouncilDistrictEntitySchema
>;
