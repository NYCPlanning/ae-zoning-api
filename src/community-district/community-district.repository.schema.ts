import { communityDistrictEntitySchema } from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const checkByIdRepoSchema = communityDistrictEntitySchema.pick({
  id: true,
});

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;
