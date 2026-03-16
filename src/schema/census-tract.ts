import {
  pgTable,
  smallint,
  text,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { multiPolygonGeom } from "src/drizzle-pgis";
import z from "zod";

export const censusTract = pgTable(
  "census_tract",
  {
    label: text("label").notNull(),
    year: smallint("year").notNull(),
    liFt: multiPolygonGeom("li_ft", 2263),
    mercatorFill: multiPolygonGeom("mercator_fill", 3857),
  },
  (table) => [
    primaryKey({ columns: [table.label, table.year] }),
    index().using("GIST", table.liFt),
    index().using("GIST", table.mercatorFill),
  ],
);

export const neighborhoodTabluationAreaEntitySchema = z.object({
  label: z.string(),
  year: z.number().int(),
});

export type NeighborhodTabulationEntity = z.infer<
  typeof neighborhoodTabluationAreaEntitySchema
>;
