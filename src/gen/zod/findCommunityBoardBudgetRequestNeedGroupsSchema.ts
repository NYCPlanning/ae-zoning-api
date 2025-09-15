import { z } from "zod";
import { communityBoardBudgetRequestNeedGroupSchema } from "./communityBoardBudgetRequestNeedGroupSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestNeedGroupsQueryParamsSchema = z
  .object({
    cbbrPolicyAreaId: z.coerce
      .number()
      .int()
      .describe("The number used to refer to the policy area.")
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
 * @description An object containing a list of need groups
 */
export const findCommunityBoardBudgetRequestNeedGroups200Schema = z.object({
  cbbrNeedGroups: z.array(
    z.lazy(() => communityBoardBudgetRequestNeedGroupSchema),
  ),
});
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestNeedGroups400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestNeedGroups500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing a list of need groups
 */
export const findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema =
  z.object({
    cbbrNeedGroups: z.array(
      z.lazy(() => communityBoardBudgetRequestNeedGroupSchema),
    ),
  });
