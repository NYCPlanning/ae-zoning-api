import {
  cbbrPolicyAreaEntitySchema,
  cbbrNeedGroupEntitySchema,
} from "src/schema";
import { z } from "zod";

export const findNeedGroupRepoSchema = z.array(cbbrNeedGroupEntitySchema);

export type FindNeedGroupsRepo = z.infer<typeof findNeedGroupRepoSchema>;

export const findPolicyAreasRepoSchema = z.array(cbbrPolicyAreaEntitySchema);

export type FindPolicyAreasRepo = z.infer<typeof findPolicyAreasRepoSchema>;

export const checkNeedGroupByIdRepoSchema = z.boolean();

export type CheckNeedGroupByIdRepo = z.infer<
  typeof checkNeedGroupByIdRepoSchema
>;

export const checkPolicyAreaByIdRepoSchema = z.boolean();

export type CheckPolicyAreaByIdRepo = z.infer<
  typeof checkPolicyAreaByIdRepoSchema
>;
