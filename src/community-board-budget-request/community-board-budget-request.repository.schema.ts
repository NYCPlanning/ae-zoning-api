import {
  cbbrPolicyAreaEntitySchema,
  cbbrNeedGroupEntitySchema,
  agencyEntitySchema,
  cbbrAgencyCategoryResponseEntitySchema,
  communityBoardBudgetRequestEntitySchema,
  multiPolygonJsonSchema,
  mvtEntitySchema,
} from "src/schema";
import { z } from "zod";

export const findAgencyRepoSchema = z.array(agencyEntitySchema);

export type FindAgenciesRepo = z.infer<typeof findAgencyRepoSchema>;

export const findNeedGroupRepoSchema = z.array(cbbrNeedGroupEntitySchema);

export type FindNeedGroupsRepo = z.infer<typeof findNeedGroupRepoSchema>;

export const findPolicyAreasRepoSchema = z.array(cbbrPolicyAreaEntitySchema);

export type FindPolicyAreasRepo = z.infer<typeof findPolicyAreasRepoSchema>;

export const findAgencyCategoryResponsesRepoSchema = z.array(
  cbbrAgencyCategoryResponseEntitySchema,
);

export type FindAgencyCategoryResponsesRepo = z.infer<
  typeof findAgencyCategoryResponsesRepoSchema
>;

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
    cbbrAgencyCategoryResponseId: z.number().nullable(),
    cbbrAgencyResponse: z.string().nullable(),
  }),
);

export const communityBoardBudgetRequestRepoSchema =
  communityBoardBudgetRequestEntitySchema
    .pick({
      id: true,
      title: true,
      isContinuedSupport: true,
      priority: true,
    })
    .extend({
      cbbrPolicyAreaId:
        communityBoardBudgetRequestEntitySchema.shape.policyArea,
      description: communityBoardBudgetRequestEntitySchema.shape.explanation,
      communityBoardId: z.string(),
      agencyInitials: communityBoardBudgetRequestEntitySchema.shape.agency,
      cbbrType: communityBoardBudgetRequestEntitySchema.shape.requestType,
      isMapped: z.boolean(),
      cbbrAgencyCategoryResponseId:
        communityBoardBudgetRequestEntitySchema.shape.agencyCategoryReponse,
      cbbrAgencyResponse:
        communityBoardBudgetRequestEntitySchema.shape.agencyResponse,
    });

export type CommunityBoardBudgetRequestRepo = z.infer<
  typeof communityBoardBudgetRequestRepoSchema
>;

export const findByIdRepoSchema = z.array(
  communityBoardBudgetRequestRepoSchema,
);

export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const communityBoardBudgetRequestGeometrySchema = z
  .union([multiPolygonJsonSchema, multiPolygonJsonSchema])
  .nullable();

export type CommunityBoardBudgetRequestGeometry = z.infer<
  typeof communityBoardBudgetRequestGeometrySchema
>;

export const manyCommunityBoardBudgetRequestRepoSchema =
  communityBoardBudgetRequestEntitySchema
    .pick({
      id: true,
      title: true,
      isContinuedSupport: true,
    })
    .extend({
      cbbrPolicyAreaId:
        communityBoardBudgetRequestEntitySchema.shape.policyArea,
      communityBoardId: z.string(),
      isMapped: z.boolean(),
    });

export type ManyCommunityBoardBudgetRequestRepo = z.infer<
  typeof manyCommunityBoardBudgetRequestRepoSchema
>;

export const findManyRepoSchema = z.array(
  manyCommunityBoardBudgetRequestRepoSchema,
);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findCountRepoSchema = z.number();

export type FindCountRepo = z.infer<typeof findCountRepoSchema>;

export const communityBoardBudgetRequestGeoJsonRepoSchema =
  communityBoardBudgetRequestRepoSchema.extend({
    geometry: communityBoardBudgetRequestGeometrySchema,
  });

export type CommunityBoardBudgetRequestGeoJsonRepo = z.infer<
  typeof communityBoardBudgetRequestGeoJsonRepoSchema
>;

export const findGeoJsonByIdRepoSchema = z.array(
  communityBoardBudgetRequestGeoJsonRepoSchema,
);

export type FindGeoJsonByIdRepo = z.infer<typeof findGeoJsonByIdRepoSchema>;

export const checkNeedGroupByIdRepoSchema = z.boolean();

export type CheckNeedGroupByIdRepo = z.infer<
  typeof checkNeedGroupByIdRepoSchema
>;

export const checkPolicyAreaByIdRepoSchema = z.boolean();

export type CheckPolicyAreaByIdRepo = z.infer<
  typeof checkPolicyAreaByIdRepoSchema
>;

export const checkAgencyCategoryResponseByIdRepoSchema = z.boolean();

export type CheckAgencyCategoryResponseByIdRepo = z.infer<
  typeof checkAgencyCategoryResponseByIdRepoSchema
>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;
