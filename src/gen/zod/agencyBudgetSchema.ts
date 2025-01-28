import { z } from "zod";

export const agencyBudgetSchema = z.object({
  code: z.coerce
    .string()
    .describe(
      "A string of variable length containing the abbreviation of the agency budget",
    ),
  type: z.coerce.string().describe("The title of the budget."),
  sponsor: z.coerce.string().describe("The initials of the sponsoring agency"),
});
