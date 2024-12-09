import { capitalProjectSchema } from "src/gen";
import {
  boroughEntitySchema,
  communityDistrictEntitySchema,
  MultiPolygonSchema,
  mvtEntitySchema,
} from "src/schema";
import { z } from "zod";

export const boroughGeoJsonEntitySchema = boroughEntitySchema.extend({
  geometry: MultiPolygonSchema,
});

export type BoroughGeoJsonEntity = z.infer<typeof boroughGeoJsonEntitySchema>;

export const findGeoJsonByIdRepoSchema = boroughGeoJsonEntitySchema;

export type FindGeoJsonByIdRepo = z.infer<typeof findGeoJsonByIdRepoSchema>;

export const findManyRepoSchema = z.array(boroughEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByIdRepoSchema = boroughEntitySchema.pick({
  id: true,
});

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

export const findCommunityDistrictsByBoroughIdRepoSchema = z.array(
  communityDistrictEntitySchema,
);

export type FindCommunityDistrictsByBoroughIdRepo = z.infer<
  typeof findCommunityDistrictsByBoroughIdRepoSchema
>;

export const communityDistrictGeoJsonEntitySchema =
  communityDistrictEntitySchema.extend({
    geometry: MultiPolygonSchema,
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

export const findCapitalProjectsByBoroughIdCommunityDistrictIdRepoSchema =
  z.array(capitalProjectSchema);

export type FindCapitalProjectsByBoroughIdCommunityDistrictIdRepo = z.infer<
  typeof findCapitalProjectsByBoroughIdCommunityDistrictIdRepoSchema
>;

export const findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema =
  mvtEntitySchema;

export type FindCapitalProjectTilesByBoroughIdCommunityDistrictIdRepo = z.infer<
  typeof findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema
>;
