import { agencyEntitySchema } from "src/schema/agency";
import { z } from "zod";

export const findManyRepoSchema = z.array(agencyEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByInitialsRepoSchema = agencyEntitySchema.pick({
  initials: true,
});

export type CheckByInitialsRepo = z.infer<typeof checkByInitialsRepoSchema>;
