import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type FindZoningDistrictClassesByTaxLotBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type FindZoningDistrictClassesByTaxLotBbl400 = Error;

export type FindZoningDistrictClassesByTaxLotBbl404 = Error;

export type FindZoningDistrictClassesByTaxLotBbl500 = Error;

/**
 * @description An object containing zoning district class schemas.
 */
export type FindZoningDistrictClassesByTaxLotBblQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
