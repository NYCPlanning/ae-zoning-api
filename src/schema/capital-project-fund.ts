import {
  char,
  foreignKey,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { capitalProject } from "./capital-project";
import { z } from "zod";
import { managingCodeEntitySchema } from "./managing-code";

export const capitalProjectFundStageEnum = pgEnum(
  "capital_project_fund_stage",
  ["adopt", "allocate", "commit", "spent"],
);

export const capitalFundCategoryEnum = pgEnum("capital_fund_category", [
  "city-non-exempt",
  "city-exempt",
  "city-cost",
  "non-city-state",
  "non-city-federal",
  "non-city-other",
  "non-city-cost",
  "total",
]);

export const capitalProjectFund = pgTable(
  "capital_project_fund",
  {
    id: uuid("id").primaryKey(),
    managingCode: char("managing_code", { length: 3 }),
    capitalProjectId: text("capital_project_id"),
    capitalFundCategory: capitalFundCategoryEnum("capital_fund_category"),
    stage: capitalProjectFundStageEnum("stage"),
    value: numeric("value"),
  },
  (table) => {
    return {
      fk: foreignKey({
        columns: [table.managingCode, table.capitalProjectId],
        foreignColumns: [capitalProject.managingCode, capitalProject.id],
        name: "custom_fk",
      }),
    };
  },
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
