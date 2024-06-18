import { z } from "zod";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all zoning district class schemas.
 */
export const findZoningDistrictClasses200Schema = z.object({
  zoningDistrictClasses: z.array(z.lazy(() => zoningDistrictClassSchema)),
});
/**
 * @description Invalid client request
 */
export const findZoningDistrictClasses400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findZoningDistrictClasses500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing all zoning district class schemas.
 */
export const findZoningDistrictClassesQueryResponseSchema = z.object({
  zoningDistrictClasses: z.array(z.lazy(() => zoningDistrictClassSchema)),
});
