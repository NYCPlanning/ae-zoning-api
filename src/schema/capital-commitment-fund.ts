import {
  numeric,
  pgTable,
  uuid,
  check,
  text,
  index,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { capitalCommitment } from "./capital-commitment";
import { sql } from "drizzle-orm";

export const capitalCommitmentFund = pgTable(
  "capital_commitment_fund",
  {
    id: uuid("id").primaryKey(),
    capitalCommitmentId: uuid("capital_commitment_id").references(
      () => capitalCommitment.id,
    ),
    category: text("capital_fund_category"),
    value: numeric("value").notNull(),
  },
  (table) => [
    check(
      "capital_commitment_fund_capital_fund_category",
      sql`${table.category} IN ('city-non-exempt', 'city-exempt', 'city-cost', 'non-city-state', 'non-city-federal', 'non-city-other', 'non-city-cost', 'total')`,
    ),
    index().on(table.category),
  ],
);

export const capitalCommitmentFundEntitySchema = z.object({
  id: z.string().uuid(),
  capitalCommitmentId: z.string().uuid(),
  category: z.string(),
  value: z.number(),
});

export type CapitalCommitmentFundEntitySchema = z.infer<
  typeof capitalCommitmentFundEntitySchema
>;
