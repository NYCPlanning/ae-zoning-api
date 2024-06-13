import type { Error } from "./Error";
import type { CapitalProjectPage } from "./CapitalProjectPage";

export type FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   * @example 1
   */
  boroughId: string;
  /**
   * @description The two character numeric string containing the number used to refer to the community district.
   * @type string
   * @example 01
   */
  communityDistrictId: string;
};

export type FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams = {
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type integer | undefined
   * @example 100
   */
  limit?: number;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type integer | undefined
   * @example 100
   */
  offset?: number;
};

export type FindCapitalProjectsByBoroughIdCommunityDistrictId400 = Error;

export type FindCapitalProjectsByBoroughIdCommunityDistrictId404 = Error;

export type FindCapitalProjectsByBoroughIdCommunityDistrictId500 = Error;

/**
 * @description An object containing pagination metadata and an array of capital projects for the community district
 */
export type FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponse =
  CapitalProjectPage;
