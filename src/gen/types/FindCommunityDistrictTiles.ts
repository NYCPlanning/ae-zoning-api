import type { Error } from "./Error";

export type FindCommunityDistrictTilesPathParams = {
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
export type FindCommunityDistrictTiles200 = Blob;
/**
 * @description Invalid client request
 */
export type FindCommunityDistrictTiles400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityDistrictTiles500 = Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCommunityDistrictTilesQueryResponse = Blob;
export type FindCommunityDistrictTilesQuery = {
  Response: FindCommunityDistrictTilesQueryResponse;
  PathParams: FindCommunityDistrictTilesPathParams;
  Errors: FindCommunityDistrictTiles400 | FindCommunityDistrictTiles500;
};
