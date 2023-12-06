import { z } from "zod";

import { zoningDistrictClassCategorySchema } from "./zoningDistrictClassCategorySchema";

export const zoningDistrictClassCategoryColorSchema = z.object({
  category: z.lazy(() => zoningDistrictClassCategorySchema).schema.optional(),
  color: z
    .string()
    .describe(`The color for the zoning district class category.`)
    .regex(new RegExp("^#([A-Fa-f0-9]{8})$"))
    .optional(),
});
