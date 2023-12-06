import { z } from "zod";

import { taxLotSchema } from "./taxLotSchema";

export const getTaxLotByBblPathParamsSchema = z.object({
  bbl: z.string().min(10).max(10),
});

/**
 * @description A tax lot object
 */
export const getTaxLotByBblQueryResponseSchema = z.lazy(
  () => taxLotSchema,
).schema;
