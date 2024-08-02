import { capitalCommitmentTypeEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(capitalCommitmentTypeEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;
