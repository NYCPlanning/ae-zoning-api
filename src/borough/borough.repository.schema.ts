import {
  boroughEntitySchema,
  communityDistrictEntitySchema,
  multiPolygonJsonSchema,
  mvtEntitySchema,
} from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(boroughEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByIdRepoSchema = z.boolean();

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

export const findCommunityDistrictsByBoroughIdRepoSchema = z.array(
  communityDistrictEntitySchema,
);

export type FindCommunityDistrictsByBoroughIdRepo = z.infer<
  typeof findCommunityDistrictsByBoroughIdRepoSchema
>;

export const communityDistrictGeoJsonEntitySchema =
  communityDistrictEntitySchema.extend({
    geometry: multiPolygonJsonSchema,
  });

export type CommunityDistrictGeoJsonEntity = z.infer<
  typeof communityDistrictGeoJsonEntitySchema
>;

export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepoSchema =
  communityDistrictGeoJsonEntitySchema;

export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepo =
  z.infer<
    typeof findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepoSchema
  >;

export const findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema =
  mvtEntitySchema;

export type FindCapitalProjectTilesByBoroughIdCommunityDistrictIdRepo = z.infer<
  typeof findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema
>;
