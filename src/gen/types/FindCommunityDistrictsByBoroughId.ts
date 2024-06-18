import type { Error } from "./Error";
import type { CommunityDistrict } from "./CommunityDistrict";

export type FindCommunityDistrictsByBoroughIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
};
/**
 * @description An object of community district schemas for the borough
 */
export type FindCommunityDistrictsByBoroughId200 = {
  /**
   * @type array
   */
  communityDistricts: CommunityDistrict[];
};
/**
 * @description Invalid client request
 */
export type FindCommunityDistrictsByBoroughId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCommunityDistrictsByBoroughId404 = Error;
/**
 * @description Server side error
 */
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
export type FindCommunityDistrictsByBoroughIdQuery = {
  Response: FindCommunityDistrictsByBoroughIdQueryResponse;
  PathParams: FindCommunityDistrictsByBoroughIdPathParams;
  Errors:
    | FindCommunityDistrictsByBoroughId400
    | FindCommunityDistrictsByBoroughId404
    | FindCommunityDistrictsByBoroughId500;
};
