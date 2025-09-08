import { z } from "zod";
import { communityBoardBudgetRequestPolicyAreaSchema } from "./communityBoardBudgetRequestPolicyAreaSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestPolicyAreasQueryParamsSchema = z
  .object({
    cbbrNeedGroupId: z.coerce
      .number()
      .int()
      .describe("The number used to refer to the need group.")
      .optional(),
    agencyInitials: z.coerce
      .string()
      .describe(
        "A string of variable length containing the initials of the agency.",
      )
      .optional(),
  })
  .optional();
/**
 * @description An object containing a list of policy areas
 */
export const findCommunityBoardBudgetRequestPolicyAreas200Schema = z.object({
  cbbrPolicyAreas: z.array(
    z.lazy(() => communityBoardBudgetRequestPolicyAreaSchema),
  ),
});
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestPolicyAreas400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestPolicyAreas500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing a list of policy areas
 */
export const findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema =
  z.object({
    cbbrPolicyAreas: z.array(
      z.lazy(() => communityBoardBudgetRequestPolicyAreaSchema),
    ),
  });
