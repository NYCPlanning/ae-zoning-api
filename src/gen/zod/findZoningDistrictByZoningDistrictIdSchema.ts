import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictSchema } from "./zoningDistrictSchema";

export const findZoningDistrictByZoningDistrictIdPathParamsSchema = z.object({
  id: z.string().uuid(),
});
export const findZoningDistrictByZoningDistrictId400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictByZoningDistrictId404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictByZoningDistrictId500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description A zoning district object
 */
export const findZoningDistrictByZoningDistrictIdQueryResponseSchema = z.lazy(
  () => zoningDistrictSchema,
).schema;
