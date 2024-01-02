import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { bblSchema } from "./bblSchema";
import { zoningDistrictSchema } from "./zoningDistrictSchema";

export const getZoningDistrictsByTaxLotBbl400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictsByTaxLotBbl404Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictsByTaxLotBbl500Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictsByTaxLotBblPathParamsSchema = z.object({
  bbl: z.lazy(() => bblSchema).schema,
});

/**
 * @description An object containing zoning districts.
 */
export const getZoningDistrictsByTaxLotBblQueryResponseSchema = z.object({
  zoningDistricts: z.array(z.lazy(() => zoningDistrictSchema).schema),
});
