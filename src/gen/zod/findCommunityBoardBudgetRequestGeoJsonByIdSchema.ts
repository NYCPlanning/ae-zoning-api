import { z } from "zod";
import { communityBoardBudgetRequestGeoJsonSchema } from "./communityBoardBudgetRequestGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestGeoJsonByIdPathParamsSchema =
  z.object({
    cbbrId: z.coerce
      .string()
      .describe("The id for the community board budget request"),
  });
/**
 * @description A geojson object of community board budget request details
 */
export const findCommunityBoardBudgetRequestGeoJsonById200Schema = z.lazy(
  () => communityBoardBudgetRequestGeoJsonSchema,
);
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestGeoJsonById400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCommunityBoardBudgetRequestGeoJsonById404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestGeoJsonById500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description A geojson object of community board budget request details
 */
export const findCommunityBoardBudgetRequestGeoJsonByIdQueryResponseSchema =
  z.lazy(() => communityBoardBudgetRequestGeoJsonSchema);
