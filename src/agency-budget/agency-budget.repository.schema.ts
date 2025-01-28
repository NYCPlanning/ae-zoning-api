import { agencyBudgetEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(agencyBudgetEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;
