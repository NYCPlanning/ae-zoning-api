import { communityDistrictEntitySchema } from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const checkByBoroughIdCommunityDistrictIdRepoSchema =
  communityDistrictEntitySchema.pick({
    boroughId: true,
    id: true,
  });

export type CheckByBoroughIdCommunityDistrictIdRepo = z.infer<
  typeof checkByBoroughIdCommunityDistrictIdRepoSchema
>;
