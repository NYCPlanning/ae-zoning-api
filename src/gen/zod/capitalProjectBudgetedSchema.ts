import { capitalProjectSchema } from "./capitalProjectSchema";
import { z } from "zod";

export const capitalProjectBudgetedSchema = z
  .lazy(() => capitalProjectSchema)
  .and(
    z.object({
      commitmentsTotal: z.coerce
        .number()
        .describe("The sum total of commitments for the capital project"),
      sponsoringAgencyInitials: z
        .array(z.coerce.string())
        .describe(
          "An array containing string values representing the sponsoring agencies initials.",
        ),
      budgetType: z
        .array(z.coerce.string())
        .describe(
          "An array containing string values representing the budget types.",
        ),
    }),
  );
