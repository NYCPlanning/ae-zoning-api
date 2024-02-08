import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const findZoningDistrictClassesByTaxLotBblPathParamsSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
});
export const findZoningDistrictClassesByTaxLotBbl400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassesByTaxLotBbl404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClassesByTaxLotBbl500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing zoning district class schemas.
 */
export const findZoningDistrictClassesByTaxLotBblQueryResponseSchema = z.object(
  {
    zoningDistrictClasses: z.array(
      z.lazy(() => zoningDistrictClassSchema).schema,
    ),
  },
);
