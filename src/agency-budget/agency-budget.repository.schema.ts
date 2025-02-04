import { agencyBudgetEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(agencyBudgetEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByCodeRepoSchema = agencyBudgetEntitySchema.pick({
  code: true,
});

export type CheckByCodeRepo = z.infer<typeof checkByCodeRepoSchema>;
