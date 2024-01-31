import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { zoningDistrictClassSchema } from "./zoningDistrictClassSchema";

export const findZoningDistrictClasses400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictClasses500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object containing all zoning district class schemas.
 */
export const findZoningDistrictClassesQueryResponseSchema = z.object({
  zoningDistrictClasses: z.array(
    z.lazy(() => zoningDistrictClassSchema).schema,
  ),
});
