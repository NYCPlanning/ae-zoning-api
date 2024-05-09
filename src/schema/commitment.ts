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
import { project } from "./project";
import { budgetLine } from "./budget-line";

export const commitment = pgTable(
  "commitment",
  {
    id: uuid("id").primaryKey(),
    type: char("type", { length: 4 }),
    plannedDate: date("planned_date"),
    managingCode: char("managing_code", { length: 3 }),
    projectId: text("project_id"),
    budgetLineCode: text("budget_line_code"),
    budgetLineId: text("budget_line_id"),
  },
  (table) => {
    return {
      projectFk: foreignKey({
        columns: [table.managingCode, table.projectId],
        foreignColumns: [project.managingCode, project.id],
      }),
      budgetLineFk: foreignKey({
        columns: [table.budgetLineCode, table.budgetLineId],
        foreignColumns: [budgetLine.code, budgetLine.id],
      }),
    };
  },
);

export const commitmentEntitySchema = z.object({
  id: z.string().uuid(),
  type: z.string().length(4),
  plannedDate: z.date(),
  managingCode: managingCodeEntitySchema,
  projectId: z.string(),
  budgetLineCode: z.string(),
  budgetLineId: z.string(),
});
