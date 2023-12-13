import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByTaxLotBblPathParams = {
  /**
   * @type string
   */
  bbl: string;
};

export type GetZoningDistrictClassesByTaxLotBbl400 = Error;

export type GetZoningDistrictClassesByTaxLotBbl404 = Error;

export type GetZoningDistrictClassesByTaxLotBbl500 = Error;

/**
 * @description An object containing zoning district class schemas.
 */
export type GetZoningDistrictClassesByTaxLotBblQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
