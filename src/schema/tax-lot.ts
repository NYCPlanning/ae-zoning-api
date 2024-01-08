import { char, pgTable, text } from "drizzle-orm/pg-core";
import { borough, landUse } from "../schema";
import { multiPolygonGeog, multiPolygonGeom, pointGeom } from "../drizzle-pgis";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { SelectLandUse } from "./land-use";
import { SelectBorough } from "./borough";

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
  mercatorFill: multiPolygonGeom("mercator_fill", 3857),
  mercatorLabel: pointGeom("mercator_label", 3857),
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

export const selectTaxLotSchema = createSelectSchema(taxLot);

export type SelectTaxLot = z.infer<typeof selectTaxLotSchema>;

export type SelectTaxLotNested = Pick<
  SelectTaxLot,
  "address" | "bbl" | "block" | "lot"
> & {
  borough: SelectBorough | null;
  landUse: SelectLandUse | null;
};

export type SelectTaxLotSpatial = SelectTaxLotNested & {
  geometry: string;
};
