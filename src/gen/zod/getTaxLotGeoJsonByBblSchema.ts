import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { bblSchema } from "./bblSchema";
import { taxLotGeoJsonSchema } from "./taxLotGeoJsonSchema";

export const getTaxLotGeoJsonByBbl400Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotGeoJsonByBbl404Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotGeoJsonByBbl500Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotGeoJsonByBblPathParamsSchema = z.object({
  bbl: z.lazy(() => bblSchema).schema,
});

/**
 * @description A tax lot geojson object
 */
export const getTaxLotGeoJsonByBblQueryResponseSchema = z.lazy(
  () => taxLotGeoJsonSchema,
).schema;
