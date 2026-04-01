import {
  pgTable,
  smallint,
  text,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { multiPolygonGeom } from "src/drizzle-pgis";
import z from "zod";

export const neighborhoodTabluationArea = pgTable(
  "neighborhood_tabulation_area",
  {
    name: text("name").notNull(),
    year: smallint("year").notNull(),
    code: text("code"),
    liFt: multiPolygonGeom("li_ft", 2263),
    mercatorFill: multiPolygonGeom("mercator_fill", 3857),
  },
  (table) => [
    primaryKey({ columns: [table.name, table.year] }),
    index().using("GIST", table.liFt),
    index().using("GIST", table.mercatorFill),
  ],
);

export const neighborhoodTabluationAreaEntitySchema = z.object({
  name: z.string(),
  year: z.number().int(),
});

export type NeighborhodTabulationEntity = z.infer<
  typeof neighborhoodTabluationAreaEntitySchema
>;
