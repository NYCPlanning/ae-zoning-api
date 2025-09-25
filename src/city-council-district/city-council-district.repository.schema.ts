import { mvtEntitySchema } from "src/schema/mvt";
import {
  cityCouncilDistrictEntitySchema,
  multiPolygonJsonSchema,
} from "src/schema";
import { z } from "zod";

export const cityCouncilDistrictGeoJsonEntitySchema =
  cityCouncilDistrictEntitySchema.extend({
    geometry: multiPolygonJsonSchema,
  });

export type CityCouncilDistrictGeoJsonEntity = z.infer<
  typeof cityCouncilDistrictGeoJsonEntitySchema
>;

export const findGeoJsonByIdRepoSchema = cityCouncilDistrictGeoJsonEntitySchema;

export type FindGeoJsonByIdRepo = z.infer<typeof findGeoJsonByIdRepoSchema>;

export const findManyRepoSchema = z.array(cityCouncilDistrictEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const findCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdRepoSchema =
  mvtEntitySchema;

export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdRepo =
  z.infer<
    typeof findCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdRepoSchema
  >;

export const findCapitalProjectTilesByCityCouncilDistrictIdRepoSchema =
  mvtEntitySchema;

export type FindCapitalProjectTilesByCityCouncilDistrictIdRepo = z.infer<
  typeof findCapitalProjectTilesByCityCouncilDistrictIdRepoSchema
>;

export const checkByIdRepoSchema = z.boolean();

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;
