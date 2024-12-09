import { z } from "zod";
import { boroughGeoJsonSchema } from "./boroughGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findBoroughGeoJsonByBoroughIdPathParamsSchema = z.object({
  boroughId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{1})$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
});
/**
 * @description A borough geojson object
 */
export const findBoroughGeoJsonByBoroughId200Schema = z.lazy(
  () => boroughGeoJsonSchema,
);
/**
 * @description Invalid client request
 */
export const findBoroughGeoJsonByBoroughId400Schema = z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findBoroughGeoJsonByBoroughId404Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findBoroughGeoJsonByBoroughId500Schema = z.lazy(() => errorSchema);
/**
 * @description A borough geojson object
 */
export const findBoroughGeoJsonByBoroughIdQueryResponseSchema = z.lazy(
  () => boroughGeoJsonSchema,
);
