import { z } from "zod";
import { agencyBudgetSchema } from "./agencyBudgetSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all agency budgets.
 */
export const findAgencyBudgets200Schema = z.object({
  agencyBudgets: z.array(z.lazy(() => agencyBudgetSchema)),
  order: z.coerce
    .string()
    .describe("Agency Budgets are sorted alphabetically by their codes"),
});
/**
 * @description Invalid client request
 */
export const findAgencyBudgets400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findAgencyBudgets500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing all agency budgets.
 */
export const findAgencyBudgetsQueryResponseSchema = z.object({
  agencyBudgets: z.array(z.lazy(() => agencyBudgetSchema)),
  order: z.coerce
    .string()
    .describe("Agency Budgets are sorted alphabetically by their codes"),
});
