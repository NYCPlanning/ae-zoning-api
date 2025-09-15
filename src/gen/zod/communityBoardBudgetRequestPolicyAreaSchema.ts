import { z } from "zod";

export const communityBoardBudgetRequestPolicyAreaSchema = z.object({
  id: z.coerce.number().int().describe("The id for the policy area"),
  description: z.coerce.string().describe("The name of the policy area."),
});
