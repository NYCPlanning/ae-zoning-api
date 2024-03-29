import { z } from "zod";
import { zoningDistrictClassEntitySchema } from "src/schema/zoning-district-class";

export const findManyRepoSchema = z.array(zoningDistrictClassEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findByIdRepoSchema = zoningDistrictClassEntitySchema;

export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const findCategoryColorsRepoSchema = z.array(
  zoningDistrictClassEntitySchema.pick({
    category: true,
    color: true,
  }),
);

export type FindCategoryColorsRepo = z.infer<
  typeof findCategoryColorsRepoSchema
>;
