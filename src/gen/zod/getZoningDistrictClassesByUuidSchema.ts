import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getZoningDistrictClassesByUuidPathParamsSchema = z.object({
  uuid: z.string().uuid(),
});
export const getZoningDistrictClassesByUuid400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesByUuid404Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictClassesByUuid500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object of class schemas for the zoning district.
 */
export const getZoningDistrictClassesByUuidQueryResponseSchema = z.object({
  zoningDistrictClasses: z.array(
    z.lazy(() => zoningDistrictClassSchema).schema,
  ),
});
