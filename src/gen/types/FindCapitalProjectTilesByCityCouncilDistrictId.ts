import type { Error } from "./Error";

export type FindCapitalProjectTilesByCityCouncilDistrictIdPathParams = {
  /**
   * @description One or two character code to represent city council districts.
   * @type string
   */
  cityCouncilDistrictId: string;
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
export type FindCapitalProjectTilesByCityCouncilDistrictId200 = string;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectTilesByCityCouncilDistrictId400 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectTilesByCityCouncilDistrictId500 = Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCapitalProjectTilesByCityCouncilDistrictIdQueryResponse =
  string;
export type FindCapitalProjectTilesByCityCouncilDistrictIdQuery = {
  Response: FindCapitalProjectTilesByCityCouncilDistrictIdQueryResponse;
  PathParams: FindCapitalProjectTilesByCityCouncilDistrictIdPathParams;
  Errors:
    | FindCapitalProjectTilesByCityCouncilDistrictId400
    | FindCapitalProjectTilesByCityCouncilDistrictId500;
};
