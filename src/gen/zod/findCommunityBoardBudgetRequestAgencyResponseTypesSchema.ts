import { z } from "zod";
import { communityBoardBudgetRequestAgencyResponseTypeSchema } from "./communityBoardBudgetRequestAgencyResponseTypeSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing a list of agency reponse types
 */
export const findCommunityBoardBudgetRequestAgencyResponseTypes200Schema =
  z.object({
    cbbrAgencyResponseTypes: z.array(
      z.lazy(() => communityBoardBudgetRequestAgencyResponseTypeSchema),
    ),
  });
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestAgencyResponseTypes400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestAgencyResponseTypes500Schema =
  z.lazy(() => errorSchema);
/**
 * @description An object containing a list of agency reponse types
 */
export const findCommunityBoardBudgetRequestAgencyResponseTypesQueryResponseSchema =
  z.object({
    cbbrAgencyResponseTypes: z.array(
      z.lazy(() => communityBoardBudgetRequestAgencyResponseTypeSchema),
    ),
  });
