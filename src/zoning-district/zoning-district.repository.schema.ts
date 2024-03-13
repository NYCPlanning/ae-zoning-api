import {
  zoningDistrictClassEntitySchema,
  zoningDistrictEntitySchema,
} from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const checkByIdRepoSchema = zoningDistrictEntitySchema.pick({
  id: true,
});

export const findFillsRepoSchema = z.array(mvtEntitySchema).length(1);

export type FindFillsRepo = z.infer<typeof findFillsRepoSchema>;

export const findLabelsRepoSchema = z.array(mvtEntitySchema).length(1);

export type FindLabelsRepo = z.infer<typeof findLabelsRepoSchema>;

export const findByUuidRepoSchema = zoningDistrictEntitySchema;

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

export const findByIdRepoSchema = zoningDistrictEntitySchema;

export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const findZoningDistrictClassesByIdRepoSchema = z.array(
  zoningDistrictClassEntitySchema,
);

export type FindZoningDistrictClassesByIdRepo = z.infer<
  typeof findZoningDistrictClassesByIdRepoSchema
>;
