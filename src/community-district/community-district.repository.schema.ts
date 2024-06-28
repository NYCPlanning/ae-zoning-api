import { communityDistrictEntitySchema } from "src/schema";
import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;

export const checkByCommunityDistrictIdRepoSchema =
  communityDistrictEntitySchema.pick({
    id: true,
  });

export type CheckByCommunityDistrictIdRepo = z.infer<
  typeof checkByCommunityDistrictIdRepoSchema
>;
