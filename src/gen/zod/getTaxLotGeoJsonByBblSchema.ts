import { z } from "zod";

import { taxLotGeoJsonSchema } from "./taxLotGeoJsonSchema";

export const getTaxLotGeoJsonByBblPathParamsSchema = z.object({
  bbl: z.string().min(10).max(10),
});

/**
 * @description A tax lot geojson object
 */
export const getTaxLotGeoJsonByBblQueryResponseSchema = z.lazy(
  () => taxLotGeoJsonSchema,
).schema;
