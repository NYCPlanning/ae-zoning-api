import type { Error } from "./Error";
import type { TaxLot } from "./TaxLot";

export type GetTaxLotByBblPathParams = {
  /**
   * @type string
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
