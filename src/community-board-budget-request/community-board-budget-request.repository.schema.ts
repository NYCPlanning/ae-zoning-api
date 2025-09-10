import { cbbrPolicyAreaEntitySchema } from "src/schema";
import { z } from "zod";

export const findPolicyAreasRepoSchema = z.array(cbbrPolicyAreaEntitySchema);

export type FindPolicyAreasRepo = z.infer<typeof findPolicyAreasRepoSchema>;
