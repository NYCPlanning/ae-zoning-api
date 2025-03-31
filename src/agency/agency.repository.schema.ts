import { agencyEntitySchema } from "src/schema/agency";
import { z } from "zod";

export const findManyRepoSchema = z.array(agencyEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByInitialsRepoSchema = z.boolean();

export type CheckByInitialsRepo = z.infer<typeof checkByInitialsRepoSchema>;
