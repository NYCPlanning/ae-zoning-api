import { z } from "zod";
import { taxLotBlockGeoJsonSchema } from "./taxLotBlockGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findTaxLotBlockGeoJsonByBoroughIdBlockIdPathParamsSchema =
  z.object({
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
/**
 * @description An geojson object for a block
 */
export const findTaxLotBlockGeoJsonByBoroughIdBlockId200Schema = z.lazy(
  () => taxLotBlockGeoJsonSchema,
);
/**
 * @description Invalid client request
 */
export const findTaxLotBlockGeoJsonByBoroughIdBlockId400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findTaxLotBlockGeoJsonByBoroughIdBlockId500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An geojson object for a block
 */
export const findTaxLotBlockGeoJsonByBoroughIdBlockIdQueryResponseSchema =
  z.lazy(() => taxLotBlockGeoJsonSchema);
