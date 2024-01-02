import type { Error } from "./Error";
import type { TaxLot } from "./TaxLot";

export type GetTaxLotByBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type GetTaxLotByBbl400 = Error;

export type GetTaxLotByBbl404 = Error;

export type GetTaxLotByBbl500 = Error;

/**
 * @description A tax lot object
 */
export type GetTaxLotByBblQueryResponse = TaxLot;
