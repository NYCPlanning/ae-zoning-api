import { z } from "zod";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";
import { errorSchema } from "./errorSchema";

export const findZoningDistrictClassesByZoningDistrictIdPathParamsSchema =
  z.object({ id: z.coerce.string().uuid() });
/**
 * @description An object of class schemas for the zoning district.
 */
export const findZoningDistrictClassesByZoningDistrictId200Schema = z.object({
  zoningDistrictClasses: z.array(z.lazy(() => zoningDistrictClassSchema)),
});
/**
 * @description Invalid client request
 */
export const findZoningDistrictClassesByZoningDistrictId400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findZoningDistrictClassesByZoningDistrictId404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findZoningDistrictClassesByZoningDistrictId500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object of class schemas for the zoning district.
 */
export const findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema =
  z.object({
    zoningDistrictClasses: z.array(z.lazy(() => zoningDistrictClassSchema)),
  });
