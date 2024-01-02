import type { Error } from "./Error";
import type { Bbl } from "./Bbl";
import type { TaxLot } from "./TaxLot";

export type GetTaxLotByBbl400 = Error;

export type GetTaxLotByBbl404 = Error;

export type GetTaxLotByBbl500 = Error;

export type GetTaxLotByBblPathParams = {
  bbl: Bbl;
};

/**
 * @description A tax lot object
 */
export type GetTaxLotByBblQueryResponse = TaxLot;
