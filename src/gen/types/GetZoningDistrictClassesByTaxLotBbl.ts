import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByTaxLotBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
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
