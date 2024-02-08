import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { taxLotGeoJsonSchema } from "./taxLotGeoJsonSchema";

export const findTaxLotGeoJsonByBblPathParamsSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
});
export const findTaxLotGeoJsonByBbl400Schema = z.lazy(() => errorSchema).schema;
export const findTaxLotGeoJsonByBbl404Schema = z.lazy(() => errorSchema).schema;
export const findTaxLotGeoJsonByBbl500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description A tax lot geojson object
 */
export const findTaxLotGeoJsonByBblQueryResponseSchema = z.lazy(
  () => taxLotGeoJsonSchema,
).schema;
