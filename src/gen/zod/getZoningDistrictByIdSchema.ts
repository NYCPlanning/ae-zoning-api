import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictSchema } from "./zoningDistrictSchema";

export const getZoningDistrictByIdPathParamsSchema = z.object({
  id: z.string().uuid(),
});
export const getZoningDistrictById400Schema = z.lazy(() => errorSchema).schema;
export const getZoningDistrictById404Schema = z.lazy(() => errorSchema).schema;
export const getZoningDistrictById500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description A zoning district object
 */
export const getZoningDistrictByIdQueryResponseSchema = z.lazy(
  () => zoningDistrictSchema,
).schema;
