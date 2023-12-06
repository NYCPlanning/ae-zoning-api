import { z } from "zod";

import { multiPolygonSchema } from "./multiPolygonSchema";
import { taxLotSchema } from "./taxLotSchema";

export const taxLotGeoJsonSchema = z.object({
  id: z.string().describe(`The bbl of the tax lot.`).min(10).max(10).optional(),
  type: z.enum([`Feature`]).optional(),
  geometry: z.lazy(() => multiPolygonSchema).schema.optional(),
  properties: z.lazy(() => taxLotSchema).schema.optional(),
});
