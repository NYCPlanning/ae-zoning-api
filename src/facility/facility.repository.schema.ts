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

export const facilityCsvRepoSchema = facilityEntitySchema
  .pick({
    id: true,
    name: true,
    address: true,
    bin: true,
    bbl: true,
    facilityJurisdiction: true,
    facilityOperatorType: true,
    operatorName: true,
    sgrLtr: true,
    sgrArcLtr: true,
    sgrSysLtr: true,
    sgrYear: true,
  })
  .extend({
    oversightAgency: agencyEntitySchema.shape.name.nullable(),
    category: facilityDomainEntitySchema.shape.name.nullable(),
    categoryGroup: facilityDomainEntitySchema.shape.name.nullable(),
    categorySubgroup: facilityDomainEntitySchema.shape.name.nullable(),
  });

export type FacilityCsvRepoSchema = z.infer<typeof facilityCsvRepoSchema>;

export const findCsvRepoSchema = z.array(facilityCsvRepoSchema);

export type FindCsvRepo = z.infer<typeof findCsvRepoSchema>;
