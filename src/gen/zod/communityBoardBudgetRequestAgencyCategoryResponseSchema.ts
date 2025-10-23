import { z } from "zod";

export const communityBoardBudgetRequestAgencyCategoryResponseSchema = z.object(
  {
    id: z.coerce
      .number()
      .int()
      .describe("The id for the agency request category."),
    description: z.coerce
      .string()
      .describe("The name of the agency request category."),
  },
);
