import type { Error } from "./Error";

export type FindCityCouncilDistrictTilesPathParams = {
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
export type FindCityCouncilDistrictTiles200 = string;
/**
 * @description Invalid client request
 */
export type FindCityCouncilDistrictTiles400 = Error;
/**
 * @description Server side error
 */
export type FindCityCouncilDistrictTiles500 = Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCityCouncilDistrictTilesQueryResponse = string;
export type FindCityCouncilDistrictTilesQuery = {
  Response: FindCityCouncilDistrictTilesQueryResponse;
  PathParams: FindCityCouncilDistrictTilesPathParams;
  Errors: FindCityCouncilDistrictTiles400 | FindCityCouncilDistrictTiles500;
};
