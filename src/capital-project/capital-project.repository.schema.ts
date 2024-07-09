import {
  agencyBudgetEntitySchema,
  agencyEntitySchema,
  capitalCommitmentEntitySchema,
  capitalCommitmentFundEntitySchema,
  capitalProjectEntitySchema,
} from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const checkByManagingCodeCapitalProjectIdRepoSchema =
  capitalProjectEntitySchema.pick({
    id: true,
    managingCode: true,
  });

export type CheckByManagingCodeCapitalProjectIdRepo = z.infer<
  typeof checkByManagingCodeCapitalProjectIdRepoSchema
>;

export const findByManagingCodeCapitalProjectIdRepoSchema = z.array(
  capitalProjectEntitySchema.extend({
    sponsoringAgencies: z.array(agencyEntitySchema.shape.initials),
    budgetTypes: z.array(agencyBudgetEntitySchema.shape.type),
    commitmentsTotal: capitalCommitmentFundEntitySchema.shape.value,
  }),
);

export type FindByManagingCodeCapitalProjectIdRepo = z.infer<
  typeof findByManagingCodeCapitalProjectIdRepoSchema
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
