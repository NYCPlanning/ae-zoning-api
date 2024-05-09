import { numeric, pgTable, uuid } from "drizzle-orm/pg-core";
import { projectCategoryEnum } from "./project";
import { z } from "zod";
import { commitment } from "./commitment";

export const commitmentFund = pgTable("commitment_fund", {
  id: uuid("id").primaryKey(),
  commitmentId: uuid("commitment_id").references(() => commitment.id),
  category: projectCategoryEnum("fund_category"),
  value: numeric("value"),
});

export const commitmentFundEntitySchema = z.object({
  id: z.string().uuid(),
  commitmentId: z.string().uuid(),
  category: z.string(),
  value: z.number(),
});

export type commitmentFundEntitySchema = z.infer<
  typeof commitmentFundEntitySchema
>;
