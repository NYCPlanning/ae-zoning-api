import type { Error } from "./Error";
import type { CommunityDistrict } from "./CommunityDistrict";

export type FindCommunityDistrictsByBoroughIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   * @example 1
   */
  boroughId: string;
};

export type FindCommunityDistrictsByBoroughId400 = Error;

export type FindCommunityDistrictsByBoroughId404 = Error;

export type FindCommunityDistrictsByBoroughId500 = Error;

/**
 * @description An object of community district schemas for the borough
 */
export type FindCommunityDistrictsByBoroughIdQueryResponse = {
  /**
   * @type array
   */
  communityDistricts: CommunityDistrict[];
};
