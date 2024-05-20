import { agencyEntitySchema } from "src/schema/agency";
import { z } from "zod";

export const findManyRepoSchema = z.array(agencyEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;
