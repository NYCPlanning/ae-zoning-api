import { mvtEntitySchema } from "src/schema/mvt";
import {
  cityCouncilDistrictEntitySchema,
  MultiPolygonSchema,
} from "src/schema";
import { z } from "zod";

export const cityCouncilDistrictGeoJsonEntitySchema =
  cityCouncilDistrictEntitySchema.extend({
    geometry: MultiPolygonSchema,
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

export const findCapitalProjectTilesByCityCouncilDistrictIdRepoSchema =
  mvtEntitySchema;

export type FindCapitalProjectTilesByCityCouncilDistrictIdRepo = z.infer<
  typeof findCapitalProjectTilesByCityCouncilDistrictIdRepoSchema
>;

export const checkByIdRepoSchema = cityCouncilDistrictEntitySchema.pick({
  id: true,
});

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;
