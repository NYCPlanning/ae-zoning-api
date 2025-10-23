import { z } from "zod";
import { communityBoardBudgetRequestAgencyCategoryResponseSchema } from "./communityBoardBudgetRequestAgencyCategoryResponseSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing a list of agency reponse categories
 */
export const findCommunityBoardBudgetRequestAgencyCategoryResponses200Schema =
  z.object({
    cbbrAgencyCategoryResponses: z.array(
      z.lazy(() => communityBoardBudgetRequestAgencyCategoryResponseSchema),
    ),
  });
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestAgencyCategoryResponses400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestAgencyCategoryResponses500Schema =
  z.lazy(() => errorSchema);
/**
 * @description An object containing a list of agency reponse categories
 */
export const findCommunityBoardBudgetRequestAgencyCategoryResponsesQueryResponseSchema =
  z.object({
    cbbrAgencyCategoryResponses: z.array(
      z.lazy(() => communityBoardBudgetRequestAgencyCategoryResponseSchema),
    ),
  });
