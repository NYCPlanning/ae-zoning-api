import { multiPolygonSchema } from "./multiPolygonSchema";
import { z } from "zod";

export const taxLotBlockGeoJsonSchema = z.object({
  id: z.coerce
    .string()
    .min(6)
    .max(6)
    .describe("The concatenated borough and block ids of the tax lot."),
  type: z.enum(["Feature"]),
  geometry: z.lazy(() => multiPolygonSchema),
  properties: z.object({
    boroughId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1})$"))
      .describe("The block code for the bbl"),
    blockId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{5})$"))
      .describe("The block code for the bbl"),
  }),
});
