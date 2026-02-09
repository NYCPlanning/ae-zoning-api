import { char, index, pgTable, text } from "drizzle-orm/pg-core";
import { multiPolygonGeom, pointGeom } from "src/drizzle-pgis";
import { z } from "zod";

export const borough = pgTable(
  "borough",
  {
    id: char("id", { length: 1 }).primaryKey(),
    title: text("title").notNull(),
    abbr: text("abbr").notNull(),
    liFt: multiPolygonGeom("li_ft", 2263),
    mercatorFill: multiPolygonGeom("mercator_fill", 3857),
    mercatorLabel: pointGeom("mercator_label", 3857),
  },
  (table) => [
    index().using("GIST", table.liFt),
    index().using("GIST", table.mercatorFill),
    index().using("GIST", table.mercatorLabel),
  ],
);

export const boroughEntitySchema = z.object({
  id: z.string().regex(/^[0-9]$/),
  title: z.string(),
  abbr: z.string().length(2),
});

export type BoroughEntity = z.infer<typeof boroughEntitySchema>;
