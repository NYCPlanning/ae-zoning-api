import type { TaxLot } from "./TaxLot";
import type { Error } from "./Error";

export type FindTaxLotByBblPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
  /**
   * @description A multi-character numeric string containing the common number used to refer to the block of a bbl.
   * @type string
   */
  blockId: string;
  /**
   * @description A multi-character numeric string containing the common number used to refer to the lot of a bbl.
   * @type string
   */
  lotId: string;
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
