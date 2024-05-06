import { pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";
import { agency } from "./agency";

export const agencyBudget = pgTable("agency_budget", {
  code: text("code").primaryKey(),
  type: text("type"),
  sponsor: text("sponsor").references(() => agency.initials),
});

export const agencyBudgetEntitySchema = z.object({
  code: z.string(),
  type: z.string(),
  sponsor: z.string(),
});

export type AgencyBudgetEntitySchema = z.infer<typeof agencyBudgetEntitySchema>;
