import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictSchema } from "./zoningDistrictSchema";

export const findZoningDistrictsByTaxLotBblPathParamsSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
});
export const findZoningDistrictsByTaxLotBbl400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictsByTaxLotBbl404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictsByTaxLotBbl500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing zoning districts.
 */
export const findZoningDistrictsByTaxLotBblQueryResponseSchema = z.object({
  zoningDistricts: z.array(z.lazy(() => zoningDistrictSchema).schema),
});
