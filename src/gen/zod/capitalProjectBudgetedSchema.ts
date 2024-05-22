import { z } from "zod";

import { capitalProjectSchema } from "./capitalProjectSchema";

export const capitalProjectBudgetedSchema = z
  .lazy(() => capitalProjectSchema)
  .schema.and(
    z.object({
      commitmentsTotal: z
        .number()
        .describe(`The sum total of commitments for the capital project`),
      sponsoringAgencyInitials: z
        .array(z.string())
        .describe(
          `An array containing string values representing the sponsoring agencies initials.`,
        ),
      budgetType: z
        .array(z.string())
        .describe(
          `An array containing string values representing the budget types.`,
        ),
    }),
  );
