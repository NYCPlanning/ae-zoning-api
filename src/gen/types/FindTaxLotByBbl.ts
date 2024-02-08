import type { Error } from "./Error";
import type { TaxLot } from "./TaxLot";

export type FindTaxLotByBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type FindTaxLotByBbl400 = Error;

export type FindTaxLotByBbl404 = Error;

export type FindTaxLotByBbl500 = Error;

/**
 * @description A tax lot object
 */
export type FindTaxLotByBblQueryResponse = TaxLot;
