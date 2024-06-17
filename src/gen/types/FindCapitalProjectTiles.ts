import type { Error } from "./Error";

export type FindCapitalProjectTilesPathParams = {
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
export type FindCapitalProjectTiles200 = Blob;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectTiles400 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectTiles500 = Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCapitalProjectTilesQueryResponse = Blob;
export type FindCapitalProjectTilesQuery = {
  Response: FindCapitalProjectTilesQueryResponse;
  PathParams: FindCapitalProjectTilesPathParams;
  Errors: FindCapitalProjectTiles400 | FindCapitalProjectTiles500;
};
