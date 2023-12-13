import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const getAllZoningDistrictClasses400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getAllZoningDistrictClasses500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing all zoning district class schemas.
 */
export const getAllZoningDistrictClassesQueryResponseSchema = z.object({
  zoningDistrictClasses: z.array(
    z.lazy(() => zoningDistrictClassSchema).schema,
  ),
});
