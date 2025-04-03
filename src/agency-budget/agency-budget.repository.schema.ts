import { agencyBudgetEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(agencyBudgetEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByCodeRepoSchema = z.boolean();

export type CheckByCodeRepo = z.infer<typeof checkByCodeRepoSchema>;
