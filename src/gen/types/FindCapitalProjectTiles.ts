import type { Error } from "./Error";

export type FindCapitalProjectTilesPathParams = {
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

export type FindCapitalProjectTilesQueryResponse = any | null;

export type FindCapitalProjectTiles400 = Error;

export type FindCapitalProjectTiles500 = Error;
