import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { bblSchema } from "./bblSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByTaxLotBbl400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesByTaxLotBbl404Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesByTaxLotBbl500Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesByTaxLotBblPathParamsSchema = z.object({
  bbl: z.lazy(() => bblSchema).schema,
});

/**
 * @description An object containing zoning district class schemas.
 */
export const getZoningDistrictClassesByTaxLotBblQueryResponseSchema = z.object({
  zoningDistrictClasses: z.array(
    z.lazy(() => zoningDistrictClassSchema).schema,
  ),
});
