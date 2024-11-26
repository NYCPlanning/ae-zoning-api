import { z } from "zod";
import { taxLotGeoJsonSchema } from "./taxLotGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findTaxLotGeoJsonByBblPathParamsSchema = z.object({
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
 * @description A tax lot geojson object
 */
export const findTaxLotGeoJsonByBbl200Schema = z.lazy(
  () => taxLotGeoJsonSchema,
);
/**
 * @description Invalid client request
 */
export const findTaxLotGeoJsonByBbl400Schema = z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findTaxLotGeoJsonByBbl404Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findTaxLotGeoJsonByBbl500Schema = z.lazy(() => errorSchema);
/**
 * @description A tax lot geojson object
 */
export const findTaxLotGeoJsonByBblQueryResponseSchema = z.lazy(
  () => taxLotGeoJsonSchema,
);
