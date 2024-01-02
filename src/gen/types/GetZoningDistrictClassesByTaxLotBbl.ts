import type { Error } from "./Error";
import type { Bbl } from "./Bbl";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByTaxLotBbl400 = Error;

export type GetZoningDistrictClassesByTaxLotBbl404 = Error;

export type GetZoningDistrictClassesByTaxLotBbl500 = Error;

export type GetZoningDistrictClassesByTaxLotBblPathParams = {
  bbl: Bbl;
};

/**
 * @description An object containing zoning district class schemas.
 */
export type GetZoningDistrictClassesByTaxLotBblQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
