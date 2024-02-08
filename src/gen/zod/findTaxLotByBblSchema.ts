import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { taxLotSchema } from "./taxLotSchema";

export const findTaxLotByBblPathParamsSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
});
export const findTaxLotByBbl400Schema = z.lazy(() => errorSchema).schema;
export const findTaxLotByBbl404Schema = z.lazy(() => errorSchema).schema;
export const findTaxLotByBbl500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description A tax lot object
 */
export const findTaxLotByBblQueryResponseSchema = z.lazy(
  () => taxLotSchema,
).schema;
