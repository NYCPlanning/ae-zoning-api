import type { Error } from "./Error";

export type FindZoningDistrictFillsPathParams = {
  /**
   * @description viewport zoom component
   * @type string
   */
  z: string;
  /**
   * @description viewport x component
   * @type string
   */
  x: string;
  /**
   * @description viewport y component
   * @type string
   */
  y: string;
};

export type FindZoningDistrictFillsQueryResponse = any | null;

export type FindZoningDistrictFills400 = Error;

export type FindZoningDistrictFills500 = Error;
