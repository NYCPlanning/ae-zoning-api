import { pageSchema } from "./pageSchema";
import { z } from "zod";

export const communityBoardBudgetRequestPageSchema = z
  .lazy(() => pageSchema)
  .and(
    z.object({
      communityBoardBudgetRequests: z.array(
        z.object({
          id: z.coerce
            .string()
            .describe("The id for the community board budget request."),
          cbbrPolicyAreaId: z.coerce
            .number()
            .int()
            .describe("The id for the policy area of the request."),
          title: z.coerce.string().describe("The title of the budget request."),
          communityBoardId: z.coerce
            .string()
            .describe("The id of the community board that made the request."),
          isMapped: z
            .boolean()
            .describe(
              "Whether the budget request has associated mappable data",
            ),
          isContinuedSupport: z
            .boolean()
            .describe("Whether the budget request is for Continued Support"),
        }),
      ),
      totalBudgetRequests: z.coerce
        .number()
        .int()
        .min(0)
        .describe("The total number of results matching the query parameters."),
    }),
  );
