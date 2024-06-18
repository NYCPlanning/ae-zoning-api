import { z } from "zod";
import { zoningDistrictSchema } from "./zoningDistrictSchema";
import { errorSchema } from "./errorSchema";

export const findZoningDistrictByZoningDistrictIdPathParamsSchema = z.object({
  id: z.coerce.string().uuid(),
});
/**
 * @description A zoning district object
 */
export const findZoningDistrictByZoningDistrictId200Schema = z.lazy(
  () => zoningDistrictSchema,
);
/**
 * @description Invalid client request
 */
export const findZoningDistrictByZoningDistrictId400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findZoningDistrictByZoningDistrictId404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findZoningDistrictByZoningDistrictId500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description A zoning district object
 */
export const findZoningDistrictByZoningDistrictIdQueryResponseSchema = z.lazy(
  () => zoningDistrictSchema,
);
