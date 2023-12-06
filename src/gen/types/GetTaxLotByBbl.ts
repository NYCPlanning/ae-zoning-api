import type { TaxLot } from "./TaxLot";

export type GetTaxLotByBblPathParams = {
  /**
   * @type string
   */
  bbl: string;
};

/**
 * @description A tax lot object
 */
export type GetTaxLotByBblQueryResponse = TaxLot;
