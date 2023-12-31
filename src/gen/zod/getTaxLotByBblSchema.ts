import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { taxLotSchema } from "./taxLotSchema";

export const getTaxLotByBblPathParamsSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
});
export const getTaxLotByBbl400Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotByBbl404Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotByBbl500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description A tax lot object
 */
export const getTaxLotByBblQueryResponseSchema = z.lazy(
  () => taxLotSchema,
).schema;
