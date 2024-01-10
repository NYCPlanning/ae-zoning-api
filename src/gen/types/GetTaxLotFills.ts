import type { Error } from "./Error";

export type GetTaxLotFillsPathParams = {
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

export type GetTaxLotFillsQueryResponse = any | null;

export type GetTaxLotFills400 = Error;

export type GetTaxLotFills500 = Error;
