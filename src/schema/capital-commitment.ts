import {
  char,
  date,
  foreignKey,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { managingCodeEntitySchema } from "./managing-code";
import { capitalProject } from "./capital-project";
import { budgetLine } from "./budget-line";
import { capitalCommitmentType } from "./capital-commitment-type";

export const capitalCommitment = pgTable(
  "captial_commitment",
  {
    id: uuid("id").primaryKey(),
    type: char("type", { length: 4 }).references(
      () => capitalCommitmentType.code,
    ),
    plannedDate: date("planned_date"),
    managingCode: char("managing_code", { length: 3 }),
    capitalProjectId: text("capital_project_id"),
    budgetLineCode: text("budget_line_code"),
    budgetLineId: text("budget_line_id"),
  },
  (table) => {
    return {
      capitalProjectFk: foreignKey({
        columns: [table.managingCode, table.capitalProjectId],
        foreignColumns: [capitalProject.managingCode, capitalProject.id],
      }),
      budgetLineFk: foreignKey({
        columns: [table.budgetLineCode, table.budgetLineId],
        foreignColumns: [budgetLine.code, budgetLine.id],
      }),
    };
  },
);

export const capitalCommitmentEntitySchema = z.object({
  id: z.string().uuid(),
  type: z.string().length(4),
  plannedDate: z.date(),
  managingCode: managingCodeEntitySchema,
  capitalProjectId: z.string(),
  budgetLineCode: z.string(),
  budgetLineId: z.string(),
});
