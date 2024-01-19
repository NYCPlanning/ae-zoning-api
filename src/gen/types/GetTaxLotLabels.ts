import type { Error } from "./Error";

export type GetTaxLotLabelsPathParams = {
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

export type GetTaxLotLabelsQueryResponse = any | null;

export type GetTaxLotLabels400 = Error;

export type GetTaxLotLabels500 = Error;
