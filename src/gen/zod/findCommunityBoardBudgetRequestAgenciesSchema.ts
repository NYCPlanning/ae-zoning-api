import { z } from "zod";
import { agencySchema } from "./agencySchema";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestAgenciesQueryParamsSchema = z
  .object({
    cbbrNeedGroupId: z.coerce
      .number()
      .int()
      .describe("The number used to refer to the need group.")
      .optional(),
    cbbrPolicyAreaId: z.coerce
      .number()
      .int()
      .describe("The number used to refer to the policy area.")
      .optional(),
  })
  .optional();
/**
 * @description An object containing a list of agencies
 */
export const findCommunityBoardBudgetRequestAgencies200Schema = z.object({
  cbbrAgencies: z.array(z.lazy(() => agencySchema)),
});
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestAgencies400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestAgencies500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing a list of agencies
 */
export const findCommunityBoardBudgetRequestAgenciesQueryResponseSchema =
  z.object({ cbbrAgencies: z.array(z.lazy(() => agencySchema)) });
