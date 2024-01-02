import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { bblSchema } from "./bblSchema";
import { taxLotSchema } from "./taxLotSchema";

export const getTaxLotByBbl400Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotByBbl404Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotByBbl500Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotByBblPathParamsSchema = z.object({
  bbl: z.lazy(() => bblSchema).schema,
});

/**
 * @description A tax lot object
 */
export const getTaxLotByBblQueryResponseSchema = z.lazy(
  () => taxLotSchema,
).schema;
