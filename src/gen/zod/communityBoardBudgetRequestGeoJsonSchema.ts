import { multiPointSchema } from "./multiPointSchema";
import { multiPolygonSchema } from "./multiPolygonSchema";
import { communityBoardBudgetRequestSchema } from "./communityBoardBudgetRequestSchema";
import { z } from "zod";

export const communityBoardBudgetRequestGeoJsonSchema = z.object({
  id: z.coerce
    .string()
    .describe("The id for the community board budget request."),
  type: z.enum(["Feature"]),
  geometry: z.union([
    z.lazy(() => multiPointSchema),
    z.lazy(() => multiPolygonSchema),
  ]),
  properties: z.lazy(() => communityBoardBudgetRequestSchema),
});
