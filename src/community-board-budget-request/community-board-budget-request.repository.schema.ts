import { cbbrPolicyAreaEntitySchema } from "src/schema";
import { z } from "zod";

export const findPolicyAreasRepoSchema = z.array(cbbrPolicyAreaEntitySchema);

export type FindPolicyAreasRepo = z.infer<typeof findPolicyAreasRepoSchema>;

export const checkNeedGroupByIdRepoSchema = z.boolean();

export type CheckNeedGroupByIdRepo = z.infer<
  typeof checkNeedGroupByIdRepoSchema
>;
