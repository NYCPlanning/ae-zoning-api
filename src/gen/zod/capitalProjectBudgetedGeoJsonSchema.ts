import { multiPointSchema } from "./multiPointSchema";
import { multiPolygonSchema } from "./multiPolygonSchema";
import { capitalProjectBudgetedSchema } from "./capitalProjectBudgetedSchema";
import { z } from "zod";

export const capitalProjectBudgetedGeoJsonSchema = z.object({
  id: z.coerce
    .string()
    .describe("The concatenation of the managing code and capital project id."),
  type: z.enum(["Feature"]),
  geometry: z.union([
    z.lazy(() => multiPointSchema),
    z.lazy(() => multiPolygonSchema),
  ]),
  properties: z.lazy(() => capitalProjectBudgetedSchema),
});
