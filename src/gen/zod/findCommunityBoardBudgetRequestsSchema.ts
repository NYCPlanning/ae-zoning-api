import { z } from "zod";
import { communityBoardBudgetRequestPageSchema } from "./communityBoardBudgetRequestPageSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestsQueryParamsSchema = z
  .object({
    communityDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{3})$"))
      .describe(
        "The three character numeric string containing the concatenation of the borough and community district ids.",
      )
      .optional(),
    cityCouncilDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1,2})$"))
      .describe(
        "One or two character code to represent city council districts.",
      )
      .optional(),
    cbbrPolicyAreaId: z.coerce
      .number()
      .int()
      .describe("The number used to refer to the policy area.")
      .optional(),
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
    cbbrType: z
      .enum(["C", "E"])
      .describe("The type of budget request, C for Capital, or E for Expense.")
      .optional(),
    cbbrAgencyResponseTypeId: z
      .array(z.coerce.number().int())
      .min(1)
      .max(6)
      .describe(
        "An array containing the IDs of the agency response types of the Community Board Budget Requests.",
      )
      .optional(),
    isMapped: z
      .boolean()
      .describe(
        "Used to filter whether a capital project or community board budget request has associated geographic coordinates.",
      )
      .optional(),
    isContinuedSupport: z
      .boolean()
      .describe(
        'Used to filter whether a community board budget request is for Continued Support. Note: All Continued Support requests are of the "Capital" cbbrType.',
      )
      .optional(),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .describe(
        "The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.",
      )
      .optional(),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .describe(
        "The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.",
      )
      .optional(),
  })
  .optional();
/**
 * @description An object containing pagination metadata and an array of community board budget requests
 */
export const findCommunityBoardBudgetRequests200Schema = z.lazy(
  () => communityBoardBudgetRequestPageSchema,
);
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequests400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequests500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing pagination metadata and an array of community board budget requests
 */
export const findCommunityBoardBudgetRequestsQueryResponseSchema = z.lazy(
  () => communityBoardBudgetRequestPageSchema,
);
