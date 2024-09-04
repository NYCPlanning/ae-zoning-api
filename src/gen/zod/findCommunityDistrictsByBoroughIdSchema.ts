import { z } from "zod";
import { communityDistrictSchema } from "./communityDistrictSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityDistrictsByBoroughIdPathParamsSchema = z.object({
  boroughId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{1})$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
});
/**
 * @description An object of community district schemas for the borough
 */
export const findCommunityDistrictsByBoroughId200Schema = z.object({
  communityDistricts: z.array(z.lazy(() => communityDistrictSchema)),
  order: z.coerce
    .string()
    .describe("Community district numbers are sorted in ascending order"),
});
/**
 * @description Invalid client request
 */
export const findCommunityDistrictsByBoroughId400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCommunityDistrictsByBoroughId404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityDistrictsByBoroughId500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object of community district schemas for the borough
 */
export const findCommunityDistrictsByBoroughIdQueryResponseSchema = z.object({
  communityDistricts: z.array(z.lazy(() => communityDistrictSchema)),
  order: z.coerce
    .string()
    .describe("Community district numbers are sorted in ascending order"),
});
