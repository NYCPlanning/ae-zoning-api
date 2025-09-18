import { z } from "zod";
import { communityBoardBudgetRequestSchema } from "./communityBoardBudgetRequestSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestByIdPathParamsSchema = z.object({
  cbbrId: z.coerce
    .string()
    .describe("The id for the community board budget request"),
});
/**
 * @description An object of community board budget request details
 */
export const findCommunityBoardBudgetRequestById200Schema = z.lazy(
  () => communityBoardBudgetRequestSchema,
);
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestById400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCommunityBoardBudgetRequestById404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestById500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object of community board budget request details
 */
export const findCommunityBoardBudgetRequestByIdQueryResponseSchema = z.lazy(
  () => communityBoardBudgetRequestSchema,
);
