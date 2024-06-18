import { z } from "zod";
import { zoningDistrictSchema } from "./zoningDistrictSchema";
import { errorSchema } from "./errorSchema";

export const findZoningDistrictsByTaxLotBblPathParamsSchema = z.object({
  bbl: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{10})$"))
    .describe(
      "The ten character code compromised of a one character borough, five character block, and four character lot codes.",
    ),
});
/**
 * @description An object containing zoning districts.
 */
export const findZoningDistrictsByTaxLotBbl200Schema = z.object({
  zoningDistricts: z.array(z.lazy(() => zoningDistrictSchema)),
});
/**
 * @description Invalid client request
 */
export const findZoningDistrictsByTaxLotBbl400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findZoningDistrictsByTaxLotBbl404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findZoningDistrictsByTaxLotBbl500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing zoning districts.
 */
export const findZoningDistrictsByTaxLotBblQueryResponseSchema = z.object({
  zoningDistricts: z.array(z.lazy(() => zoningDistrictSchema)),
});
