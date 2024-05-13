import { char, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const capitalCommitmentType = pgTable("capital_commitment_type", {
  code: char("code", { length: 4 }).primaryKey(),
  description: text("description"),
});

export const capitalCommitmentTypeEntitySchema = z.object({
  code: z.string().length(4),
  description: z.string(),
});

export type CaptialCommitmentTypeEntitySchema = z.infer<
  typeof capitalCommitmentTypeEntitySchema
>;
