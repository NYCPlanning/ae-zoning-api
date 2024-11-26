import { z } from "zod";
import { zoningDistrictSchema } from "./zoningDistrictSchema";
import { errorSchema } from "./errorSchema";

export const findZoningDistrictsByTaxLotBblPathParamsSchema = z.object({
  boroughId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{1})$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
  blockId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{5})$"))
    .describe(
      "A multi-character numeric string containing the common number used to refer to the block of a bbl.",
    ),
  lotId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{4})$"))
    .describe(
      "A multi-character numeric string containing the common number used to refer to the lot of a bbl.",
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
