import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByIdPathParamsSchema = z.object({
  id: z.string().regex(new RegExp("^[A-z][0-9]+$")),
});
export const getZoningDistrictClassesById400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesById404Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesById500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description A class schema for a zoning district
 */
export const getZoningDistrictClassesByIdQueryResponseSchema = z.lazy(
  () => zoningDistrictClassSchema,
).schema;
