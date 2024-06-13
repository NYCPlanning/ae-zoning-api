import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { capitalProjectPageSchema } from "./capitalProjectPageSchema";

export const findCapitalProjectsByCityCouncilIdPathParamsSchema = z.object({
  cityCouncilDistrictId: z
    .string()
    .describe(`One or two character code to represent city council districts.`)
    .regex(new RegExp("^([0-9]{1,2})$")),
});
export const findCapitalProjectsByCityCouncilIdQueryParamsSchema = z.object({
  limit: z
    .number()
    .describe(
      `The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.`,
    )
    .min(1)
    .max(100)
    .optional(),
  offset: z
    .number()
    .describe(
      `The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.`,
    )
    .min(0)
    .optional(),
});
export const findCapitalProjectsByCityCouncilId400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCapitalProjectsByCityCouncilId404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCapitalProjectsByCityCouncilId500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing pagination metadata and an array of capital projects for the city council district
 */
export const findCapitalProjectsByCityCouncilIdQueryResponseSchema = z.lazy(
  () => capitalProjectPageSchema,
).schema;
