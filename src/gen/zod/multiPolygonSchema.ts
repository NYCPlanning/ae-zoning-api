import { z } from "zod";

import { positionSchema } from "./positionSchema";

export const multiPolygonSchema = z.object({
  type: z.enum([`MultiPolygon`]),
  coordinates: z
    .array(z.array(z.array(z.lazy(() => positionSchema).schema)))
    .describe(`Array of polygon coordinate arrays.`),
});
