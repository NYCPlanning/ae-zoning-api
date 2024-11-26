import { z } from "zod";
import { taxLotBasicPageSchema } from "./taxLotBasicPageSchema";
import { errorSchema } from "./errorSchema";

export const findTaxLotByBoroughIdBlockIdPathParamsSchema = z.object({
  boroughId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{1})$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
  blockId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{5})$"))
    .describe(
      "A multi-character numeric string containing the common number used to refer to the block of a bbl.",
    ),
});

export const findTaxLotByBoroughIdBlockIdQueryParamsSchema = z
  .object({
    lotIdQuery: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1,4})$"))
      .describe(
        "A multi-character numeric string containing the common number used to refer to the lot of a bbl. Does not need to include leading zeros.",
      )
      .optional(),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .describe(
        "The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.",
      )
      .optional(),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .describe(
        "The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.",
      )
      .optional(),
  })
  .optional();
/**
 * @description An object containing a list of tax lots and pagination metadata for lots in a block. Optionally, results may be limited to lots matching a query.
 */
export const findTaxLotByBoroughIdBlockId200Schema = z.lazy(
  () => taxLotBasicPageSchema,
);
/**
 * @description Invalid client request
 */
export const findTaxLotByBoroughIdBlockId400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findTaxLotByBoroughIdBlockId500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing a list of tax lots and pagination metadata for lots in a block. Optionally, results may be limited to lots matching a query.
 */
export const findTaxLotByBoroughIdBlockIdQueryResponseSchema = z.lazy(
  () => taxLotBasicPageSchema,
);
