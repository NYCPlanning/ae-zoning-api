import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByIdPathParamsSchema = z.object({
  id: z.string().regex(new RegExp("^((C[1-8])|(M[1-3])|(R([1-9]|10)))$")),
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
