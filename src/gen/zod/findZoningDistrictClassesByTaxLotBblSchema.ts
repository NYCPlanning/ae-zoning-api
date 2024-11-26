import { z } from "zod";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";
import { errorSchema } from "./errorSchema";

export const findZoningDistrictClassesByTaxLotBblPathParamsSchema = z.object({
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
 * @description An object containing zoning district class schemas.
 */
export const findZoningDistrictClassesByTaxLotBbl200Schema = z.object({
  zoningDistrictClasses: z.array(z.lazy(() => zoningDistrictClassSchema)),
});
/**
 * @description Invalid client request
 */
export const findZoningDistrictClassesByTaxLotBbl400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findZoningDistrictClassesByTaxLotBbl404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findZoningDistrictClassesByTaxLotBbl500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing zoning district class schemas.
 */
export const findZoningDistrictClassesByTaxLotBblQueryResponseSchema = z.object(
  { zoningDistrictClasses: z.array(z.lazy(() => zoningDistrictClassSchema)) },
);
