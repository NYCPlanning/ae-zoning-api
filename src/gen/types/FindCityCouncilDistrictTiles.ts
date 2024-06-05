import type { Error } from "./Error";

export type FindCityCouncilDistrictTilesPathParams = {
  /**
   * @description viewport zoom component
   * @type integer
   * @example 7
   */
  z: number;
  /**
   * @description viewport x component
   * @type integer
   * @example 1000
   */
  x: number;
  /**
   * @description viewport y component
   * @type integer
   * @example 1000
   */
  y: number;
};

export type FindCityCouncilDistrictTilesQueryResponse = any | null;

export type FindCityCouncilDistrictTiles400 = Error;

export type FindCityCouncilDistrictTiles500 = Error;
