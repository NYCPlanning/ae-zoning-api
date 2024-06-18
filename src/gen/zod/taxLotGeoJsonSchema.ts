import { multiPolygonSchema } from "./multiPolygonSchema";
import { taxLotSchema } from "./taxLotSchema";
import { z } from "zod";

export const taxLotGeoJsonSchema = z.object({
  id: z.coerce.string().min(10).max(10).describe("The bbl of the tax lot."),
  type: z.enum(["Feature"]),
  geometry: z.lazy(() => multiPolygonSchema),
  properties: z.lazy(() => taxLotSchema),
});
