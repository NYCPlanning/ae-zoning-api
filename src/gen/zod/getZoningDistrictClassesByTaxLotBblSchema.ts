import { z } from "zod";

import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByTaxLotBblPathParamsSchema = z.object({
  bbl: z.string().min(10).max(10),
});

/**
 * @description An array of zoning district class schemas
 */
export const getZoningDistrictClassesByTaxLotBblQueryResponseSchema = z.object({
  zoningDistrictClasses: z
    .array(z.lazy(() => zoningDistrictClassSchema).schema)
    .optional(),
});
