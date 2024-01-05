import type { Error } from "./Error";

export type GetZoningDistrictLabelsPathParams = {
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

export type GetZoningDistrictLabelsQueryResponse = any | null;

export type GetZoningDistrictLabels400 = Error;

export type GetZoningDistrictLabels500 = Error;
