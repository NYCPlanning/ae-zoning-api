import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassCategoryColorSchema } from "./zoningDistrictClassCategoryColorSchema";

export const getZoningDistrictClassCategoryColors400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassCategoryColors500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing all zoning district category colors.
 */
export const getZoningDistrictClassCategoryColorsQueryResponseSchema = z.object(
  {
    zoningDistrictClassCategoryColors: z.array(
      z.lazy(() => zoningDistrictClassCategoryColorSchema).schema,
    ),
  },
);
