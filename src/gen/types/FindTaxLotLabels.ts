import type { Error } from "./Error";

export type FindTaxLotLabelsPathParams = {
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

export type FindTaxLotLabelsQueryResponse = any | null;

export type FindTaxLotLabels400 = Error;

export type FindTaxLotLabels500 = Error;
