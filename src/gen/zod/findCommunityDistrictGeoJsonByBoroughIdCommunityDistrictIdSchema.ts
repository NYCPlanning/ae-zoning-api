import { z } from "zod";
import { communityDistrictGeoJsonSchema } from "./communityDistrictGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParamsSchema =
  z.object({
    boroughId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1})$"))
      .describe(
        "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
      ),
    communityDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{2})$"))
      .describe(
        "The two character numeric string containing the number used to refer to the community district.",
      ),
  });
/**
 * @description a community district geojson object
 */
export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId200Schema =
  z.lazy(() => communityDistrictGeoJsonSchema);
/**
 * @description Invalid client request
 */
export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId404Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId500Schema =
  z.lazy(() => errorSchema);
/**
 * @description a community district geojson object
 */
export const findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponseSchema =
  z.lazy(() => communityDistrictGeoJsonSchema);
