import {
  pgTable,
  smallint,
  text,
  primaryKey,
  index,
  char,
} from "drizzle-orm/pg-core";
import { borough, boroughEntitySchema } from "./borough";
import { multiPolygonGeom } from "src/drizzle-pgis";
import z from "zod";

export const censusTract = pgTable(
  "census_tract",
  {
    boroughId: char("borough_id", { length: 1 })
      .notNull()
      .references(() => borough.id),
    label: text("label").notNull(),
    year: smallint("year").notNull(),
    liFt: multiPolygonGeom("li_ft", 2263),
    mercatorFill: multiPolygonGeom("mercator_fill", 3857),
  },
  (table) => [
    primaryKey({ columns: [table.boroughId, table.label, table.year] }),
    index().using("GIST", table.liFt),
    index().using("GIST", table.mercatorFill),
  ],
);

export const censusTractEntitySchema = z.object({
  boroughId: boroughEntitySchema.shape.id,
  label: z.string(),
  year: z.number().int(),
});

export type CensusTractEntity = z.infer<typeof censusTractEntitySchema>;
