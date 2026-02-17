import z from "zod";
import { geomSchema } from "src/types";

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
