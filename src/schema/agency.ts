import { pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const agency = pgTable("agency", {
  initials: text("initials").primaryKey(),
  name: text("name"),
});

export const agencyEntitySchema = z.object({
  initials: z.string(),
  name: z.string(),
});

export type AgencyEntitySchema = z.infer<typeof agencyEntitySchema>;
