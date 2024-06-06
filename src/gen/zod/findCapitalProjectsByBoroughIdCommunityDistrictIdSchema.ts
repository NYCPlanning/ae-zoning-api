import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { capitalProjectPageSchema } from "./capitalProjectPageSchema";

export const findCapitalProjectsByBoroughIdCommunityDistrictIdPathParamsSchema =
  z.object({
    boroughId: z
      .string()
      .describe(
        `A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.`,
      )
      .regex(new RegExp("^([0-9]{1})$")),
    communityDistrictId: z
      .string()
      .describe(
        `The two character numeric string containing the number used to refer to the community district.`,
      )
      .regex(new RegExp("^([0-9]{2})$")),
  });
export const findCapitalProjectsByBoroughIdCommunityDistrictId400Schema =
  z.lazy(() => errorSchema).schema;
export const findCapitalProjectsByBoroughIdCommunityDistrictId404Schema =
  z.lazy(() => errorSchema).schema;
export const findCapitalProjectsByBoroughIdCommunityDistrictId500Schema =
  z.lazy(() => errorSchema).schema;

/**
 * @description An object containing pagination metadata and an array of capital projects for the community district
 */
export const findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema =
  z.lazy(() => capitalProjectPageSchema).schema;
