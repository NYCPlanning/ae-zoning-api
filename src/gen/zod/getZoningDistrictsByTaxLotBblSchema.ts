import { z } from "zod";

import { zoningDistrictSchema } from "./zoningDistrictSchema";

export const getZoningDistrictsByTaxLotBblPathParamsSchema = z.object({
  bbl: z.string().min(10).max(10),
});

/**
 * @description An array of zoning district objects
 */
export const getZoningDistrictsByTaxLotBblQueryResponseSchema = z.object({
  zoningDistricts: z
    .array(z.lazy(() => zoningDistrictSchema).schema)
    .optional(),
});
