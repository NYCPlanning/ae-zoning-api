import {
  agencyBudgetEntitySchema,
  agencyEntitySchema,
  capitalCommitmentFundEntitySchema,
  capitalProjectEntitySchema,
} from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

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
