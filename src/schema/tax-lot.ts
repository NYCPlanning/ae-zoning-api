import { char, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { borough, boroughIdEntitySchema, landUse } from "../schema";
import { multiPolygonGeog, multiPolygonGeom } from "../drizzle-pgis";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const taxLot = pgTable(
  "tax_lot",
  {
    boroughId: char("borough_id", { length: 1 })
      .notNull()
      .references(() => borough.id),
    blockId: char("block_id", { length: 5 }).notNull(),
    lotId: char("lot_id", { length: 4 }).notNull(),
    address: text("address"),
    landUseId: char("land_use_id", { length: 2 }).references(() => landUse.id),
    wgs84: multiPolygonGeog("wgs84", 4326).notNull(),
    liFt: multiPolygonGeom("li_ft", 2263).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.boroughId, table.blockId, table.lotId] }),
  ],
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

export const taxLotEntitySchema = z.object({
  boroughId: boroughIdEntitySchema,
  blockId: z.string().regex(/^[0-9]{5}/),
  lotId: z.string().regex(/^[0-9]{4}/),
  address: z.string().nullable(),
  landUseId: z.string().length(2).nullable(),
});
