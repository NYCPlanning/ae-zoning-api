import { z } from "zod";

export const capitalCommitmentSchema = z.object({
  id: z.coerce
    .string()
    .uuid()
    .describe("A uuid used to refer to the capital commitment."),
  type: z.coerce
    .string()
    .regex(new RegExp("^([A-z]{4})$"))
    .describe("A four character string used to refer to the commitment type."),
  plannedDate: z
    .string()
    .date()
    .describe(
      "A string used to refer to the date when the commitment is projected to be committed.",
    ),
  budgetLineCode: z.coerce
    .string()
    .describe("A string used to refer to the budget line."),
  budgetLineId: z.coerce
    .string()
    .describe("A string used to refer to the budget line."),
  sponsoringAgencies: z.coerce
    .string()
    .describe(
      "A string of variable length containing the initials of the sponsoring agency.",
    ),
  budgetType: z.coerce
    .string()
    .describe("A string of variable length denoting the type of budget."),
  totalValue: z.coerce
    .number()
    .describe(
      "A numeric string used to refer to the amount of total planned commitments.",
    ),
});
