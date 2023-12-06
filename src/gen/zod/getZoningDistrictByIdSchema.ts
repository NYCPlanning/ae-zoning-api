import { z } from "zod";

import { zoningDistrictSchema } from "./zoningDistrictSchema";

export const getZoningDistrictByIdPathParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * @description A zoning district object
 */
export const getZoningDistrictByIdQueryResponseSchema = z.lazy(
  () => zoningDistrictSchema,
).schema;
