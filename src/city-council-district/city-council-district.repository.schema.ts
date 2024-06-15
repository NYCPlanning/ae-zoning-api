import { mvtEntitySchema } from "src/schema/mvt";
import { cityCouncilDistrictEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(cityCouncilDistrictEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;
