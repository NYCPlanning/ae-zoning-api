import {
  cbbrPolicyAreaEntitySchema,
  cbbrNeedGroupEntitySchema,
  agencyEntitySchema,
  mvtEntitySchema,
} from "src/schema";
import { z } from "zod";

export const findAgencyRepoSchema = z.array(agencyEntitySchema);

export type FindAgenciesRepo = z.infer<typeof findAgencyRepoSchema>;

export const findNeedGroupRepoSchema = z.array(cbbrNeedGroupEntitySchema);

export type FindNeedGroupsRepo = z.infer<typeof findNeedGroupRepoSchema>;

export const findPolicyAreasRepoSchema = z.array(cbbrPolicyAreaEntitySchema);

export type FindPolicyAreasRepo = z.infer<typeof findPolicyAreasRepoSchema>;

export const findCommunityBoardBudgetRequestByIdRepoSchema = z.array(
  z.object({
    id: z.string(),
    cbbrPolicyAreaId: z.number(),
    title: z.string(),
    communityBoardId: z.string(),
    description: z.string().nullable(),
    agencyInitials: z.string(),
    priority: z.number(),
    cbbrType: z.enum(["Capital", "Expense"]),
    isMapped: z.boolean(),
    isContinuedSupport: z.boolean(),
    agencyCategoryResponse: z.number().nullable(),
    agencyResponse: z.string().nullable(),
  }),
);

export type FindCommunityBoardBudgetRequestByIdRepo = z.infer<
  typeof findCommunityBoardBudgetRequestByIdRepoSchema
>;

export const checkNeedGroupByIdRepoSchema = z.boolean();

export type CheckNeedGroupByIdRepo = z.infer<
  typeof checkNeedGroupByIdRepoSchema
>;

export const checkPolicyAreaByIdRepoSchema = z.boolean();

export type CheckPolicyAreaByIdRepo = z.infer<
  typeof checkPolicyAreaByIdRepoSchema
>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;
