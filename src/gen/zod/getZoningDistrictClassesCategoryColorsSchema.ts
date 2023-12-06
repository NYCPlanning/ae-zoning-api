import { z } from "zod";

import { zoningDistrictClassCategoryColorSchema } from "./zoningDistrictClassCategoryColorSchema";

/**
 * @description An array of all zoning district category colors.
 */
export const getZoningDistrictClassesCategoryColorsQueryResponseSchema =
  z.object({
    zoningDistrictClassCategoryColors: z
      .array(z.lazy(() => zoningDistrictClassCategoryColorSchema).schema)
      .optional(),
  });
