import type { Error } from "./Error";

export type FindZoningDistrictLabelsPathParams = {
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

export type FindZoningDistrictLabelsQueryResponse = any | null;

export type FindZoningDistrictLabels400 = Error;

export type FindZoningDistrictLabels500 = Error;
