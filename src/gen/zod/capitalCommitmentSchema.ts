import { z } from "zod";

export const capitalCommitmentSchema = z.object({
  id: z
    .string()
    .describe(`A uuid used to refer to the capital commitment.`)
    .uuid(),
  type: z
    .string()
    .describe(`A four character string used to refer to the commitment type.`)
    .regex(new RegExp("^([A-z]{4})$")),
  plannedDate: z
    .string()
    .describe(
      `A string used to refer to the date when the commitment is projected to be committed.`,
    ),
  budgetLineCode: z
    .string()
    .describe(`A string used to refer to the budget line.`),
  budgetLineId: z
    .string()
    .describe(`A string used to refer to the budget line.`),
  sponsoringAgencyInitials: z
    .string()
    .describe(
      `A string of variable length containing the initials of the sponsoring agency.`,
    ),
  budgetType: z
    .string()
    .describe(`A string of variable length denoting the type of budget.`),
  totalValue: z
    .number()
    .describe(
      `A numeric string used to refer to the amount of total planned commitments.`,
    ),
});
