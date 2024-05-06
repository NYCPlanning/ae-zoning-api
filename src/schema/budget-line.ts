import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { z } from "zod";
import { agencyBudget } from "./agency-budget";

export const budgetLine = pgTable(
  "budget_line",
  {
    code: text("code").references(() => agencyBudget.code),
    id: text("id"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.code, table.id] }),
    };
  },
);

export const budgetLineEntitySchema = z.object({
  code: z.string(),
  id: z.string(),
});

export type BudgetLineEntitySchema = z.infer<typeof budgetLineEntitySchema>;
