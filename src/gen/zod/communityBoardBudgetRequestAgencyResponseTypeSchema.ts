import { z } from "zod";

export const communityBoardBudgetRequestAgencyResponseTypeSchema = z.object({
  id: z.coerce.number().int().describe("The id for the agency request type"),
  description: z.coerce
    .string()
    .describe("The name of the agency request type."),
});
