import { z } from "zod";

export const communityBoardBudgetRequestNeedGroupSchema = z.object({
  id: z.coerce.number().int().describe("The id for the need group"),
  description: z.coerce.string().describe("The name of the need group."),
});
