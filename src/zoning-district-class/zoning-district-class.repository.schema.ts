import { zoningDistrictClassEntitySchema } from "src/schema/zoning-district-class";
import { z } from "zod";

export const findAllRepoSchema = z.array(zoningDistrictClassEntitySchema);

export type FindAllRepo = z.infer<typeof findAllRepoSchema>;
