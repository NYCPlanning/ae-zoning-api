import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const checkByBoroughIdCommunityDistrictIdRepoSchema = z.boolean();

export type CheckByBoroughIdCommunityDistrictIdRepo = z.infer<
  typeof checkByBoroughIdCommunityDistrictIdRepoSchema
>;

export const checkByBoroughIdCommunityDistrictIdsRepoSchema = z.boolean();

export type CheckByBoroughIdCommunityDistrictIdsRepo = z.infer<
  typeof checkByBoroughIdCommunityDistrictIdsRepoSchema
>;
