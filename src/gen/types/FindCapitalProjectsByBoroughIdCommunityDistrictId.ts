import type { CapitalProjectPage } from "./CapitalProjectPage";
import type { Error } from "./Error";

export type FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams = {
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
export type FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams = {
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type integer | undefined
   */
  limit?: number;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type integer | undefined
   */
  offset?: number;
};
/**
 * @description An object containing pagination metadata and an array of capital projects for the community district
 */
export type FindCapitalProjectsByBoroughIdCommunityDistrictId200 =
  CapitalProjectPage;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectsByBoroughIdCommunityDistrictId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCapitalProjectsByBoroughIdCommunityDistrictId404 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectsByBoroughIdCommunityDistrictId500 = Error;
/**
 * @description An object containing pagination metadata and an array of capital projects for the community district
 */
export type FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponse =
  CapitalProjectPage;
export type FindCapitalProjectsByBoroughIdCommunityDistrictIdQuery = {
  Response: FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponse;
  PathParams: FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams;
  QueryParams: FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams;
  Errors:
    | FindCapitalProjectsByBoroughIdCommunityDistrictId400
    | FindCapitalProjectsByBoroughIdCommunityDistrictId404
    | FindCapitalProjectsByBoroughIdCommunityDistrictId500;
};
