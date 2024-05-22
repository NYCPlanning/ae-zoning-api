import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { communityDistrictSchema } from "./communityDistrictSchema";

export const findCommunityDistrictsByBoroughIdPathParamsSchema = z.object({
  boroughId: z
    .string()
    .describe(
      `A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.`,
    )
    .regex(new RegExp("^([0-9]{1})$")),
});
export const findCommunityDistrictsByBoroughId400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCommunityDistrictsByBoroughId404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCommunityDistrictsByBoroughId500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object of community district schemas for the borough
 */
export const findCommunityDistrictsByBoroughIdQueryResponseSchema = z.object({
  communityDistricts: z.array(z.lazy(() => communityDistrictSchema).schema),
});
