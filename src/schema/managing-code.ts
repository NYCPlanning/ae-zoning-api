import { char, pgTable } from "drizzle-orm/pg-core";
import { z } from "zod";

export const managingCode = pgTable("managing_code", {
  id: char("id", { length: 3 }).primaryKey(),
});

export const managingCodeEntitySchema = z.object({
  id: z.string().regex(RegExp("^[0-9]{3}$")),
});

export type ManagingCodeEntity = z.infer<typeof managingCodeEntitySchema>;
