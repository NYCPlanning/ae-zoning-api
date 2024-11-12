import { char, index, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { borough } from "./borough";
import { multiPolygonGeom, pointGeom } from "src/drizzle-pgis";
import { z } from "zod";

export const communityDistrict = pgTable(
  "community_district",
  {
    boroughId: char("borough_id", { length: 1 })
      .notNull()
      .references(() => borough.id),
    id: char("id", { length: 2 }).notNull(),
    liFt: multiPolygonGeom("li_ft", 2263),
    mercatorFill: multiPolygonGeom("mercator_fill", 3857),
    mercatorLabel: pointGeom("mercator_label", 3857),
  },
  (table) => [
    primaryKey({ columns: [table.boroughId, table.id] }),
    index().using("GIST", table.liFt),
    index().using("GIST", table.mercatorFill),
    index().using("GIST", table.mercatorLabel),
  ],
);

export const communityDistrictEntitySchema = z.object({
  boroughId: z.string().length(1).regex(new RegExp("[0-9]")),
  id: z.string().length(2).regex(new RegExp("^([0-9]{2})$")),
});

export type CommunityDistrictEntity = z.infer<
  typeof communityDistrictEntitySchema
>;
