import { landUseEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(landUseEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;
