import {
  communityDistrictEntitySchema,
} from "src/schema";
import { z } from "zod";

// export const checkByIdRepoSchema = communityDistrictEntitySchema.pick({
//   id: true,
// });

// export type CheckByIdRepo = z.infer<typeof checkByIdRepoSchema>;

// export const findByIdRepoSchema = communityDistrictEntitySchema;

// export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const findCommunityDistrictsByBoroughIdRepoSchema = z.array(
  communityDistrictEntitySchema,
);

export type FindCommunityDistrictsByBoroughIdRepo = z.infer<
  typeof findCommunityDistrictsByBoroughIdRepoSchema
>;
