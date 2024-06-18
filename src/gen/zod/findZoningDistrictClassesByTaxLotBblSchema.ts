import { z } from "zod";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";
import { errorSchema } from "./errorSchema";

export const findZoningDistrictClassesByTaxLotBblPathParamsSchema = z.object({
  bbl: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{10})$"))
    .describe(
      "The ten character code compromised of a one character borough, five character block, and four character lot codes.",
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
