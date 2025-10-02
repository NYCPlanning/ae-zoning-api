import { z } from "zod";
import {
  boroughEntitySchema,
  landUseEntitySchema,
  multiPolygonJsonSchema,
  zoningDistrictClassEntitySchema,
  zoningDistrictEntitySchema,
} from "src/schema";
import { taxLotEntitySchema } from "src/schema/tax-lot";
import { geomSchema } from "src/types";

export const checkByBblRepoSchema = z.boolean();

export type CheckByBblRepo = z.infer<typeof checkByBblRepoSchema>;

export const findManyRepoSchema = z.array(taxLotEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findManyBySpatialFilterRepoSchema = findManyRepoSchema;

export type FindManyBySpatialFilterRepo = z.infer<
  typeof findManyBySpatialFilterRepoSchema
>;

export const findGeomFromGeoJsonRepoSchema = z.string(geomSchema);

export type FindGeomFromGeoJsonRepo = z.infer<
  typeof findGeomFromGeoJsonRepoSchema
>;

export const findGeomBufferRepoSchema = z.string(geomSchema);

export type FindGeomBufferRepo = z.infer<typeof findGeomBufferRepoSchema>;

export const checkGeomIsValidRepoSchema = z.boolean();

export type CheckGeomIsValidRepo = z.infer<typeof checkGeomIsValidRepoSchema>;

export const findMaximumInscribedCircleCenterRepoSchema = z.string(geomSchema);

export type FindMaximumInscribedCircleCenterRepo = z.infer<
  typeof findMaximumInscribedCircleCenterRepoSchema
>;

export const findByBblRepoSchema = taxLotEntitySchema
  .omit({ boroughId: true, landUseId: true })
  .extend({
    borough: boroughEntitySchema,
    landUse: landUseEntitySchema.nullable(),
  });

export type FindByBblRepo = z.infer<typeof findByBblRepoSchema>;

export const findByBblSpatialRepoSchema = findByBblRepoSchema.extend({
  geometry: multiPolygonJsonSchema,
});

export type FindByBblSpatialRepo = z.infer<typeof findByBblSpatialRepoSchema>;

export const findZoningDistrictsByBblRepoSchema = z.array(
  zoningDistrictEntitySchema,
);

export type FindZoningDistrictsByBblRepo = z.infer<
  typeof findZoningDistrictsByBblRepoSchema
>;

export const findZoningDistrictClassesByBblRepoSchema = z.array(
  zoningDistrictClassEntitySchema,
);

export type FindZoningDistrictClassesByBblRepo = z.infer<
  typeof findZoningDistrictClassesByBblRepoSchema
>;
