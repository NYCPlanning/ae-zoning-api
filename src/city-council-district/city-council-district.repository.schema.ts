import { cityCouncilDistrictEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(cityCouncilDistrictEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;
