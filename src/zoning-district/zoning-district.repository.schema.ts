import {
  zoningDistrictClassEntitySchema,
  zoningDistrictEntitySchema,
} from "src/schema";
import { z } from "zod";

export const checkByIdRepoSchema = z.boolean();

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

export const findByIdRepoSchema = zoningDistrictEntitySchema;

export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const findZoningDistrictClassesByIdRepoSchema = z.array(
  zoningDistrictClassEntitySchema,
);

export type FindZoningDistrictClassesByIdRepo = z.infer<
  typeof findZoningDistrictClassesByIdRepoSchema
>;
