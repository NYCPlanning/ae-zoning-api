import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassCategoryColorSchema } from "./zoningDistrictClassCategoryColorSchema";

export const findZoningDistrictClassCategoryColors400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassCategoryColors500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing all zoning district category colors.
 */
export const findZoningDistrictClassCategoryColorsQueryResponseSchema =
  z.object({
    zoningDistrictClassCategoryColors: z.array(
      z.lazy(() => zoningDistrictClassCategoryColorSchema).schema,
    ),
  });
