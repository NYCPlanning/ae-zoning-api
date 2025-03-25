import { z } from "zod";
import { capitalProjectPageSchema } from "./capitalProjectPageSchema";
import { errorSchema } from "./errorSchema";

export const findCapitalProjectsByBoroughIdCommunityDistrictIdPathParamsSchema =
  z.object({
    boroughId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1})$"))
      .describe(
        "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
      ),
    communityDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{2})$"))
      .describe(
        "The two character numeric string containing the number used to refer to the community district.",
      ),
  });

export const findCapitalProjectsByBoroughIdCommunityDistrictIdQueryParamsSchema =
  z
    .object({
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .describe(
          "The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.",
        )
        .optional(),
      offset: z.coerce
        .number()
        .int()
        .min(0)
        .describe(
          "The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.",
        )
        .optional(),
    })
    .optional();
/**
 * @description An object containing pagination metadata and an array of capital projects for the community district
 */
export const findCapitalProjectsByBoroughIdCommunityDistrictId200Schema =
  z.lazy(() => capitalProjectPageSchema);
/**
 * @description Invalid client request
 */
export const findCapitalProjectsByBoroughIdCommunityDistrictId400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCapitalProjectsByBoroughIdCommunityDistrictId500Schema =
  z.lazy(() => errorSchema);
/**
 * @description An object containing pagination metadata and an array of capital projects for the community district
 */
export const findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema =
  z.lazy(() => capitalProjectPageSchema);
