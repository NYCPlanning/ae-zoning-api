import { z } from "zod";

import { multiPolygonSchema } from "./multiPolygonSchema";
import { taxLotSchema } from "./taxLotSchema";

export const taxLotGeoJsonSchema = z.object({
  id: z.string().describe(`The bbl of the tax lot.`).min(10).max(10),
  type: z.enum([`Feature`]),
  geometry: z.lazy(() => multiPolygonSchema).schema,
  properties: z.lazy(() => taxLotSchema).schema,
});
