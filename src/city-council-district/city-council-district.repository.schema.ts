import { mvtEntitySchema } from "src/schema/mvt";
import {
  capitalProjectEntitySchema,
  cityCouncilDistrictEntitySchema,
} from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(cityCouncilDistrictEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const checkByIdRepoSchema = cityCouncilDistrictEntitySchema.pick({
  id: true,
});

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

export const findCapitalProjectsByCityCouncilDistrictIdRepoSchema = z.array(
  capitalProjectEntitySchema,
);

export type FindCapitalProjectsByCityCouncilDistrictIdRepo = z.infer<
  typeof findCapitalProjectsByCityCouncilDistrictIdRepoSchema
>;
