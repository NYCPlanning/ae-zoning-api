import { z } from "zod";

import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByIdPathParamsSchema = z.object({
  id: z.string().regex(new RegExp("^((C[1-8])|(M[1-3])|(R([1-9]|10)))$")),
});

/**
 * @description A class schema for a zoning district
 */
export const getZoningDistrictClassesByIdQueryResponseSchema = z.lazy(
  () => zoningDistrictClassSchema,
).schema;
