import { z } from "zod";
import { taxLotSchema } from "./taxLotSchema";
import { errorSchema } from "./errorSchema";

export const findTaxLotByBblPathParamsSchema = z.object({
  bbl: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{10})$"))
    .describe(
      "The ten character code compromised of a one character borough, five character block, and four character lot codes.",
    ),
});
/**
 * @description A tax lot object
 */
export const findTaxLotByBbl200Schema = z.lazy(() => taxLotSchema);
/**
 * @description Invalid client request
 */
export const findTaxLotByBbl400Schema = z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findTaxLotByBbl404Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findTaxLotByBbl500Schema = z.lazy(() => errorSchema);
/**
 * @description A tax lot object
 */
export const findTaxLotByBblQueryResponseSchema = z.lazy(() => taxLotSchema);
