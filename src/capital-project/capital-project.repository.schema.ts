import {
  agencyBudgetEntitySchema,
  agencyEntitySchema,
  capitalCommitmentEntitySchema,
  capitalCommitmentFundEntitySchema,
  capitalProjectEntitySchema,
  multiPointJsonSchema,
  multiPolygonJsonSchema,
} from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const findManyRepoSchema = z.array(capitalProjectEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findManagingAgenciesRepoSchema = z.array(agencyEntitySchema);

export type FindManagingAgenciesRepo = z.infer<
  typeof findManagingAgenciesRepoSchema
>;

export const findCountRepoSchema = z.number();

export type FindCountRepo = z.infer<typeof findCountRepoSchema>;

export const checkByManagingCodeCapitalProjectIdRepoSchema = z.boolean();

export type CheckByManagingCodeCapitalProjectIdRepo = z.infer<
  typeof checkByManagingCodeCapitalProjectIdRepoSchema
>;

export const capitalProjectBudgetedEntitySchema =
  capitalProjectEntitySchema.extend({
    sponsoringAgencies: z.array(agencyEntitySchema.shape.initials),
    budgetTypes: z.array(agencyBudgetEntitySchema.shape.type),
    commitmentsTotal: capitalCommitmentFundEntitySchema.shape.value,
  });

export type CapitalProjectBudgetedEntity = z.infer<
  typeof capitalProjectBudgetedEntitySchema
>;

export const findByManagingCodeCapitalProjectIdRepoSchema = z.array(
  capitalProjectBudgetedEntitySchema,
);

export type FindByManagingCodeCapitalProjectIdRepo = z.infer<
  typeof findByManagingCodeCapitalProjectIdRepoSchema
>;

export const capitalProjectGeometrySchema = z
  .union([multiPointJsonSchema, multiPolygonJsonSchema])
  .nullable();

export type CapitalProjectGeometrySchema = z.infer<
  typeof capitalProjectGeometrySchema
>;

export const capitalProjectBudgetedGeoJsonEntitySchema =
  capitalProjectBudgetedEntitySchema.extend({
    geometry: capitalProjectGeometrySchema,
  });

export type CapitalProjectBudgetedGeoJsonEntityRepo = z.infer<
  typeof capitalProjectBudgetedGeoJsonEntitySchema
>;

export const findGeoJsonByManagingCodeCapitalProjectIdRepoSchema = z.array(
  capitalProjectBudgetedGeoJsonEntitySchema,
);

export type FindGeoJsonByManagingCodeCapitalProjectIdRepo = z.infer<
  typeof findGeoJsonByManagingCodeCapitalProjectIdRepoSchema
>;
export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema =
  z.array(
    capitalCommitmentEntitySchema
      .pick({
        id: true,
        type: true,
        plannedDate: true,
        budgetLineCode: true,
        budgetLineId: true,
      })
      .extend({
        sponsoringAgency: agencyBudgetEntitySchema.shape.sponsor,
        budgetType: agencyBudgetEntitySchema.shape.type,
        totalValue: capitalCommitmentFundEntitySchema.shape.value,
      }),
  );

export type FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo = z.infer<
  typeof findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema
>;
