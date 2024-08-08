import type { Error } from "./Error";

export type FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams = {
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
  /**
   * @description viewport zoom component
   * @type integer
   */
  z: number;
  /**
   * @description viewport x component
   * @type integer
   */
  x: number;
  /**
   * @description viewport y component
   * @type integer
   */
  y: number;
};
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCapitalProjectTilesByBoroughIdCommunityDistrictId200 = string;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectTilesByBoroughIdCommunityDistrictId400 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectTilesByBoroughIdCommunityDistrictId500 = Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCapitalProjectTilesByBoroughIdCommunityDistrictIdQueryResponse =
  string;
export type FindCapitalProjectTilesByBoroughIdCommunityDistrictIdQuery = {
  Response: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdQueryResponse;
  PathParams: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams;
  Errors:
    | FindCapitalProjectTilesByBoroughIdCommunityDistrictId400
    | FindCapitalProjectTilesByBoroughIdCommunityDistrictId500;
};
