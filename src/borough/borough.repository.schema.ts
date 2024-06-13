import { capitalProjectSchema } from "src/gen";
import { boroughEntitySchema, communityDistrictEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(boroughEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const checkByIdRepoSchema = boroughEntitySchema.pick({
  id: true,
});

export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

export const findCommunityDistrictsByBoroughIdRepoSchema = z.array(
  communityDistrictEntitySchema,
);

export type FindCommunityDistrictsByBoroughIdRepo = z.infer<
  typeof findCommunityDistrictsByBoroughIdRepoSchema
>;

export const findCapitalProjectsByBoroughIdCommunityDistrictIdRepoSchema =
  z.array(capitalProjectSchema);

export type FindCapitalProjectsByBoroughIdCommunityDistrictIdRepo = z.infer<
  typeof findCapitalProjectsByBoroughIdCommunityDistrictIdRepoSchema
>;
