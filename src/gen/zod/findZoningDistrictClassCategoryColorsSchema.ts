import { z } from "zod";
import { zoningDistrictClassCategoryColorSchema } from "./zoningDistrictClassCategoryColorSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all zoning district category colors.
 */
export const findZoningDistrictClassCategoryColors200Schema = z.object({
  zoningDistrictClassCategoryColors: z.array(
    z.lazy(() => zoningDistrictClassCategoryColorSchema),
  ),
});
/**
 * @description Invalid client request
 */
export const findZoningDistrictClassCategoryColors400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findZoningDistrictClassCategoryColors500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing all zoning district category colors.
 */
export const findZoningDistrictClassCategoryColorsQueryResponseSchema =
  z.object({
    zoningDistrictClassCategoryColors: z.array(
      z.lazy(() => zoningDistrictClassCategoryColorSchema),
    ),
  });
