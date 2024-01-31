import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const findZoningDistrictClassesByZoningDistrictIdPathParamsSchema =
  z.object({ id: z.string().uuid() });
export const findZoningDistrictClassesByZoningDistrictId400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassesByZoningDistrictId404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassesByZoningDistrictId500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object of class schemas for the zoning district.
 */
export const findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema =
  z.object({
    zoningDistrictClasses: z.array(
      z.lazy(() => zoningDistrictClassSchema).schema,
    ),
  });
