import type { Error } from "./Error";

export type GetZoningDistrictFillsPathParams = {
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

export type GetZoningDistrictFillsQueryResponse = any | null;

export type GetZoningDistrictFills400 = Error;

export type GetZoningDistrictFills500 = Error;
