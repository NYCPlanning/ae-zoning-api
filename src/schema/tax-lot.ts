import { char, pgTable, text } from "drizzle-orm/pg-core";
import { borough, landUse, pointSchema } from "../schema";
import { multiPolygonGeog, multiPolygonGeom } from "../drizzle-pgis";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { LandUse, landUseSchema } from "./land-use";
import { Borough, boroughSchema } from "./borough";
import { multiPolygonSchema } from "./spatial";

export const taxLot = pgTable("tax_lot", {
  bbl: char("bbl", { length: 10 }).primaryKey(),
  boroughId: char("borough_id", { length: 1 })
    .notNull()
    .references(() => borough.id),
  block: text("block").notNull(),
  lot: text("lot").notNull(),
  address: text("address"),
  landUseId: char("land_use_id", { length: 2 }).references(() => landUse.id),
  wgs84: multiPolygonGeog("wgs84", 4326).notNull(),
  liFt: multiPolygonGeom("li_ft", 2263).notNull(),
});

export const taxLotRelations = relations(taxLot, ({ one }) => ({
  borough: one(borough, {
    fields: [taxLot.boroughId],
    references: [borough.id],
  }),
  landUse: one(landUse, {
    fields: [taxLot.landUseId],
    references: [landUse.id],
  }),
}));

export const taxLotSchema = createSelectSchema(taxLot);

export type TaxLot = z.infer<typeof taxLotSchema>;

export type SelectTaxLotNested = Pick<
  TaxLot,
  "address" | "bbl" | "block" | "lot"
> & {
  borough: Borough | null;
  landUse: LandUse | null;
};

export type SelectTaxLotSpatial = SelectTaxLotNested & {
  geometry: string;
};

export const findByBblSchema = z.object({
  bbl: z.string().regex(RegExp("^([0-9]{10})$")),
  block: z.string().regex(RegExp("^([0-9]{1,5})$")),
  lot: z.string().regex(RegExp("^([0-9]{1,4})$")),
  address: z.string().nullable(),
  borough: boroughSchema,
  landUse: landUseSchema.nullable(),
});

export type FindByBbl = z.infer<typeof findByBblSchema>;

export const findByBblSpatialSchema = findByBblSchema.extend({
  // geometry: z.string().transform((str) => JSON.parse(str)).pipe(multiPolygonSchema)
  // geometry: z.string()
  // geometry: multiPolygonSchema,
  // geometry: pointSchema
  // geometry: z.array(z.number()).length(2),
  geometry: z
    .string()
    .regex(/^\[\[(\[[1-9][0-9]\.[0-9]{5}\,[1-9][0-9]\.[0-9]{5}\](,\[[1-9][0-9]\.[0-9]{5}\,[1-9][0-9]\.[0-9]{5}\]){4,})\]\]$/),
});

// Polygon regex
// ^\[\[(\[[1-9][0-9]\.[0-9]{5}\,[1-9][0-9]\.[0-9]{5}\](,\[[1-9][0-9]\.[0-9]{5}\,[1-9][0-9]\.[0-9]{5}\]){4,})\]\]$

// Test for multipolygon regex
/**
 * [[[[73.95472,40.68788],[73.95472,40.65423],[73.91728,40.65423],[73.91728,40.68788],[73.95472,40.68788]],[[73.95472,40.68788],[73.95472,40.65423],[73.91728,40.65423],[73.91728,40.68788],[73.95472,40.68788]]]]
 */
export type findByBblSpatial = z.infer<typeof findByBblSpatialSchema>;
