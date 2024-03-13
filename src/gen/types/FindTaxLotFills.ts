import type { Error } from "./Error";

export type FindTaxLotFillsPathParams = {
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

export type FindTaxLotFillsQueryResponse = any | null;

export type FindTaxLotFills400 = Error;

export type FindTaxLotFills500 = Error;
