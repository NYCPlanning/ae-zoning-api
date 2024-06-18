import { zoningDistrictClassCategorySchema } from "./zoningDistrictClassCategorySchema";
import { z } from "zod";

export const zoningDistrictClassCategoryColorSchema = z.object({
  category: z.lazy(() => zoningDistrictClassCategorySchema),
  color: z.coerce
    .string()
    .regex(new RegExp("^#([A-Fa-f0-9]{8})$"))
    .describe("The color for the zoning district class category."),
});
