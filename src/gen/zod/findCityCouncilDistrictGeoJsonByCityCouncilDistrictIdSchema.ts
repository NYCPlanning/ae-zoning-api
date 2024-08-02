import { z } from "zod";
import { cityCouncilDistrictGeoJsonSchema } from "./cityCouncilDistrictGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParamsSchema =
  z.object({
    cityCouncilDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1,2})$"))
      .describe(
        "One or two character code to represent city council districts.",
      ),
  });
/**
 * @description a city council district geojson object
 */
export const findCityCouncilDistrictGeoJsonByCityCouncilDistrictId200Schema =
  z.lazy(() => cityCouncilDistrictGeoJsonSchema);
/**
 * @description Invalid client request
 */
export const findCityCouncilDistrictGeoJsonByCityCouncilDistrictId400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCityCouncilDistrictGeoJsonByCityCouncilDistrictId404Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCityCouncilDistrictGeoJsonByCityCouncilDistrictId500Schema =
  z.lazy(() => errorSchema);
/**
 * @description a city council district geojson object
 */
export const findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponseSchema =
  z.lazy(() => cityCouncilDistrictGeoJsonSchema);
