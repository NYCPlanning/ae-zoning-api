import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema =
  z.object({ id: z.string().regex(new RegExp("^[A-z][0-9]+$")) });
export const findZoningDistrictClassByZoningDistrictClassId400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassByZoningDistrictClassId404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassByZoningDistrictClassId500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description A class schema for a zoning district
 */
export const findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema =
  z.lazy(() => zoningDistrictClassSchema).schema;
