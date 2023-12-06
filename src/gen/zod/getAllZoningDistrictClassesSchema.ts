import { z } from "zod";

import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

/**
 * @description An array of all zoning district class schemas
 */
export const getAllZoningDistrictClassesQueryResponseSchema = z.object({
  zoningDistrictClasses: z
    .array(z.lazy(() => zoningDistrictClassSchema).schema)
    .optional(),
});
