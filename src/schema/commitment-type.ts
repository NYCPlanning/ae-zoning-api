import { char, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const commitmentType = pgTable("commitment_type", {
  code: char("code", { length: 4 }).primaryKey(),
  description: text("description"),
});

export const commitmentTypeEntitySchema = z.object({
  code: z.string().length(4),
  description: z.string(),
});

export type CommitmentTypeEntitySchema = z.infer<
  typeof commitmentTypeEntitySchema
>;
