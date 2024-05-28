import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { cityCouncilDistrictSchema } from "./cityCouncilDistrictSchema";

export const findCityCouncilDistricts400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCityCouncilDistricts500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description an object of city council districts
 */
export const findCityCouncilDistrictsQueryResponseSchema = z.object({
  cityCouncilDistricts: z.array(z.lazy(() => cityCouncilDistrictSchema).schema),
});
