import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { taxLotGeoJsonSchema } from "./taxLotGeoJsonSchema";

export const getTaxLotGeoJsonByBblPathParamsSchema = z.object({
  bbl: z.string().min(10).max(10),
});
export const getTaxLotGeoJsonByBbl400Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotGeoJsonByBbl404Schema = z.lazy(() => errorSchema).schema;
export const getTaxLotGeoJsonByBbl500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description A tax lot geojson object
 */
export const getTaxLotGeoJsonByBblQueryResponseSchema = z.lazy(
  () => taxLotGeoJsonSchema,
).schema;
