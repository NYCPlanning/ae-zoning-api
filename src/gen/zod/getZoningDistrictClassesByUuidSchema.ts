import { z } from "zod";

import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByUuidPathParamsSchema = z.object({
  uuid: z.string().uuid(),
});

/**
 * @description An array of class schemas for the zoning district
 */
export const getZoningDistrictClassesByUuidQueryResponseSchema = z.object({
  zoningDistrictClasses: z
    .array(z.lazy(() => zoningDistrictClassSchema).schema)
    .optional(),
});
