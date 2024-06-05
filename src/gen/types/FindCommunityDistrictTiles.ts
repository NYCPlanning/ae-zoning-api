import type { Error } from "./Error";

export type FindCommunityDistrictTilesPathParams = {
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

export type FindCommunityDistrictTilesQueryResponse = any | null;

export type FindCommunityDistrictTiles400 = Error;

export type FindCommunityDistrictTiles500 = Error;
