import { numeric, pgTable, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { capitalCommitment } from "./capital-commitment";
import { capitalFundCategoryEnum } from "./capital-project-fund";

export const captialCommitmentFund = pgTable("capital_commitment_fund", {
  id: uuid("id").primaryKey(),
  capitalCommitmentId: uuid("capital_commitment_id").references(
    () => capitalCommitment.id,
  ),
  category: capitalFundCategoryEnum("capital_fund_category"),
  value: numeric("value"),
});

export const capitalCommitmentFundEntitySchema = z.object({
  id: z.string().uuid(),
  capitalCommitmentId: z.string().uuid(),
  category: z.string(),
  value: z.number(),
});

export type commitmentFundEntitySchema = z.infer<
  typeof capitalCommitmentFundEntitySchema
>;