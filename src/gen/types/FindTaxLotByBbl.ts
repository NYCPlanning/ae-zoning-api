import type { TaxLot } from "./TaxLot";
import type { Error } from "./Error";

export type FindTaxLotByBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   */
  bbl: string;
};
/**
 * @description A tax lot object
 */
export type FindTaxLotByBbl200 = TaxLot;
/**
 * @description Invalid client request
 */
export type FindTaxLotByBbl400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindTaxLotByBbl404 = Error;
/**
 * @description Server side error
 */
export type FindTaxLotByBbl500 = Error;
/**
 * @description A tax lot object
 */
export type FindTaxLotByBblQueryResponse = TaxLot;
export type FindTaxLotByBblQuery = {
  Response: FindTaxLotByBblQueryResponse;
  PathParams: FindTaxLotByBblPathParams;
  Errors: FindTaxLotByBbl400 | FindTaxLotByBbl404 | FindTaxLotByBbl500;
};
