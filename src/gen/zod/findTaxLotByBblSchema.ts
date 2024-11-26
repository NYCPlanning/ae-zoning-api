import { z } from "zod";
import { taxLotSchema } from "./taxLotSchema";
import { errorSchema } from "./errorSchema";

export const findTaxLotByBblPathParamsSchema = z.object({
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
  lotId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{4})$"))
    .describe(
      "A multi-character numeric string containing the common number used to refer to the lot of a bbl.",
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
