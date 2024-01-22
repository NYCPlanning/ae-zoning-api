import { z } from "zod";
import { zoningDistrictClassEntitySchema } from "src/schema/zoning-district-class";

export const findAllRepoSchema = z.array(zoningDistrictClassEntitySchema);

export type FindAllRepo = z.infer<typeof findAllRepoSchema>;

export const findByIdRepoSchema = zoningDistrictClassEntitySchema;

export type findByIdRepo = z.infer<typeof findByIdRepoSchema>;
