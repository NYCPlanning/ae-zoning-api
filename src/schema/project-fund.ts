import {
  char,
  foreignKey,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { project, projectCategoryEnum } from "./project";
import { z } from "zod";
import { managingCodeEntitySchema } from "./managing-code";

export const projectFundStageEnum = pgEnum("project_fund_stage", [
  "adopt",
  "allocate",
  "commit",
  "spent",
]);

export const fundCategoryEnum = pgEnum("fund_category", [
  "city-non-exempt",
  "city-exempt",
  "city-cost",
  "non-city-state",
  "non-city-federal",
  "non-city-other",
  "non-city-cost",
  "total",
]);

export const projectFund = pgTable(
  "project_fund",
  {
    id: uuid("id").primaryKey(),
    managingCode: char("managing_code", { length: 3 }),
    projectId: text("project_id"),
    category: projectCategoryEnum("project_category"),
    stage: projectFundStageEnum("project_fund_stage"),
    value: numeric("value"),
  },
  (table) => {
    return {
      fk: foreignKey({
        columns: [table.managingCode, table.projectId],
        foreignColumns: [project.managingCode, project.id],
        name: "custom_fk",
      }),
    };
  },
);

export const projectFundEntitySchema = z.object({
  id: z.string().uuid(),
  managingCode: managingCodeEntitySchema,
  projectId: z.string(),
  category: z.string(),
  stage: z.string(),
  value: z.number(),
});

export type ProjectFundEntitySchema = z.infer<typeof projectFundEntitySchema>;
