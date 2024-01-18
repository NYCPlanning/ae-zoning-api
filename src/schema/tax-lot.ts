import { char, pgTable, text } from "drizzle-orm/pg-core";
import {
  borough,
  boroughIdEntitySchema,
  landUse,
  landUseIdEntitySchema,
} from "../schema";
import { multiPolygonGeog, multiPolygonGeom } from "../drizzle-pgis";
import { relations } from "drizzle-orm";
import { z } from "zod";

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

export const taxLotEntitySchema = z.object({
  bbl: z.string().regex(RegExp("^([0-9]{10})$")),
  boroughId: boroughIdEntitySchema,
  block: z.string().regex(RegExp("^([0-9]{1,5})$")),
  lot: z.string().regex(RegExp("^([0-9]{1,4})$")),
  address: z.string().nullable(),
  landUseId: landUseIdEntitySchema,
});
