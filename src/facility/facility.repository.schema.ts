import { agencyEntitySchema, multiPointJsonSchema } from "src/schema";
import {
  facilityDomainEntitySchema,
  facilityEntitySchema,
  facilityPageItemEntitySchema,
  mvtEntitySchema,
} from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(facilityPageItemEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findByIdRepoSchema = z.array(facilityEntitySchema);

export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const findDomainRepoSchema = z.array(facilityDomainEntitySchema);

export type FindDomainRepo = z.infer<typeof findDomainRepoSchema>;

export const findAgenciesRepoSchema = z.array(agencyEntitySchema);

export type FindAgenciesRepo = z.infer<typeof findAgenciesRepoSchema>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const facilityGeometrySchema = facilityEntitySchema.extend({
  geometry: multiPointJsonSchema,
});

export type FacilityGeometry = z.infer<typeof facilityGeometrySchema>;

export const findGeoJsonByFacilityIdRepoSchema = z.array(
  facilityGeometrySchema,
);

export type FindGeoJsonByFacilityIdRepo = z.infer<
  typeof findGeoJsonByFacilityIdRepoSchema
>;
