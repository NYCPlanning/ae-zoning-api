import {
  cbbrPolicyAreaEntitySchema,
  cbbrNeedGroupEntitySchema,
  agencyEntitySchema,
  cbbrAgencyCategoryResponseEntitySchema,
  communityBoardBudgetRequestEntitySchema,
  cbbrRequestTypeEntitySchema,
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

export const findAgencyResponseTypesRepoSchema = z.array(
  cbbrAgencyCategoryResponseEntitySchema,
);

export type FindAgencyResponseTypesRepo = z.infer<
  typeof findAgencyResponseTypesRepoSchema
>;

export const communityBoardBudgetRequestRepoSchema =
  communityBoardBudgetRequestEntitySchema
    .omit({
      boroughId: true,
      communityDistrictId: true,
      requestType: true,
      isLocationSpecific: true,
    })
    .extend({
      communityBoardId: z.string(),
      cbbrType: cbbrRequestTypeEntitySchema,
      isMapped: z.boolean(),
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
      cbbrPolicyAreaId: true,
      title: true,
      isContinuedSupport: true,
    })
    .extend({
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

export const checkAgencyResponseTypeByIdRepoSchema = z.boolean();

export type CheckAgencyResponseTypeByIdRepo = z.infer<
  typeof checkAgencyResponseTypeByIdRepoSchema
>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;
