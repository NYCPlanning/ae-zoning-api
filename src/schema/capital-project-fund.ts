import {
  char,
  check,
  foreignKey,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { capitalProject } from "./capital-project";
import { z } from "zod";
import { managingCodeEntitySchema } from "./managing-code";
import { sql } from "drizzle-orm";

export const capitalProjectFund = pgTable(
  "capital_project_fund",
  {
    id: uuid("id").primaryKey(),
    managingCode: char("managing_code", { length: 3 }),
    capitalProjectId: text("capital_project_id"),
    capitalFundCategory: text("capital_fund_category"),
    stage: text("stage"),
    value: numeric("value"),
  },
  (table) => [
    foreignKey({
      columns: [table.managingCode, table.capitalProjectId],
      foreignColumns: [capitalProject.managingCode, capitalProject.id],
      name: "custom_fk",
    }),
    check(
      "capital_project_fund_stage_options",
      sql`${table.stage} IN ('adopt', 'allocate', 'commit', 'spent')`,
    ),
    check(
      "capital_project_fund_capital_fund_category",
      sql`${table.capitalFundCategory} IN ('city-non-exempt', 'city-exempt', 'city-cost', 'non-city-state', 'non-city-federal', 'non-city-other', 'non-city-cost', 'total')`,
    ),
  ],
);

export const capitalProjectFundEntitySchema = z.object({
  id: z.string().uuid(),
  managingCode: managingCodeEntitySchema,
  capitalProjectId: z.string(),
  category: z.string(),
  stage: z.string(),
  value: z.number(),
});

export type ProjectFundEntitySchema = z.infer<
  typeof capitalProjectFundEntitySchema
>;
