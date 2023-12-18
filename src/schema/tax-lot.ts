import { char, index, pgTable, text } from "drizzle-orm/pg-core";
import { borough, landUse } from "../schema";
import { multiPolygonGeog, multiPolygonGeom } from "../drizzle-pgis";
import { relations, sql } from "drizzle-orm";

export const taxLot = pgTable(
  "tax_lot",
  {
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
  },
  (taxLot) => {
    return {
      liFtIdx: index("tax_lot_li_ft_gix")
        .on(taxLot.liFt)
        .using(sql`GIST(${taxLot.liFt})`),
    };
  },
);

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
