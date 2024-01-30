import {
  zoningDistrictClassEntitySchema,
  zoningDistrictEntitySchema,
} from "src/schema";
import { z } from "zod";

export const checkByIdRepoSchema = zoningDistrictEntitySchema.pick({
  id: true,
});

export type CheckByIdRepoSchema = z.infer<typeof checkByIdRepoSchema>;

export const findByUuidRepoSchema = zoningDistrictEntitySchema;

export type FindByUuidRepo = z.infer<typeof findByUuidRepoSchema>;

export const findClassesByIdRepoSchema = z.array(
  zoningDistrictClassEntitySchema,
);

export type FindClassesByIdRepo = z.infer<typeof findClassesByIdRepoSchema>;
