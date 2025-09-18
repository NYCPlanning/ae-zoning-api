import { communityBoardBudgetRequestTypeSchema } from "./communityBoardBudgetRequestTypeSchema";
import { z } from "zod";

export const communityBoardBudgetRequestSchema = z.object({
  id: z.coerce
    .string()
    .describe("The id for the community board budget request."),
  cbbrPolicyAreaId: z.coerce
    .number()
    .int()
    .describe("The id for the policy area of the request."),
  title: z.coerce.string().describe("The title of the budget request."),
  description: z.coerce.string().describe("Description of the budget request."),
  communityBoardId: z.coerce
    .string()
    .describe("The id of the community board that made the request."),
  agencyInitials: z.coerce
    .string()
    .describe("Initials of the agency of which the request was made."),
  priority: z.coerce
    .number()
    .describe("The board's ranking of the request's priority"),
  cbbrType: z.lazy(() => communityBoardBudgetRequestTypeSchema),
  isMapped: z
    .boolean()
    .describe("Whether the budget request has associated mappable data"),
  isContinuedSupport: z
    .boolean()
    .describe("Whether the budget request is for Continued Support"),
  cbbrAgencyResponseTypeId: z.coerce
    .number()
    .describe("The id of the agency's response type")
    .optional(),
  cbbrAgencyResponse: z.coerce
    .string()
    .describe("The agency's written explanation for the response type")
    .optional(),
});
