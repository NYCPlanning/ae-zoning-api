import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { capitalProjectPageSchema } from "./capitalProjectPageSchema";

export const findCapitalProjectsByCityCouncilIdPathParamsSchema = z.object({
  cityCouncilDistrictId: z
    .string()
    .describe(`One or two character code to represent city council districts.`)
    .regex(new RegExp("^([0-9]{1,2})$")),
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
