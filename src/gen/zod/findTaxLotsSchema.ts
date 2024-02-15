import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { taxLotBasicPageSchema } from "./taxLotBasicPageSchema";

export const findTaxLotsQueryParamsSchema = z.object({
  limit: z
    .number()
    .describe(
      `The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.`,
    )
    .min(1)
    .max(100)
    .optional(),
  offset: z
    .number()
    .describe(
      `The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.`,
    )
    .min(0)
    .optional(),
});
export const findTaxLots400Schema = z.lazy(() => errorSchema).schema;
export const findTaxLots500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing a list of tax lots and pagination metadata
 */
export const findTaxLotsQueryResponseSchema = z.lazy(
  () => taxLotBasicPageSchema,
).schema;
