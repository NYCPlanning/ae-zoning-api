import type { Error } from "./Error";
import type { CommunityDistrictGeoJson } from "./CommunityDistrictGeoJson";

export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams =
  {
    /**
     * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
     * @type string
     */
    boroughId: string;
    /**
     * @description The two character numeric string containing the number used to refer to the community district.
     * @type string
     */
    communityDistrictId: string;
  };
/**
 * @description a community district geojson object
 */
export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId200 =
  CommunityDistrictGeoJson;
/**
 * @description Invalid client request
 */
export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId400 =
  Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId404 =
  Error;
/**
 * @description Server side error
 */
export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId500 =
  Error;
/**
 * @description a community district geojson object
 */
export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponse =
  CommunityDistrictGeoJson;
export type FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQuery = {
  Response: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponse;
  PathParams: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams;
  Errors:
    | FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId400
    | FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId404
    | FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId500;
};
