import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type FindZoningDistrictClassesByTaxLotBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   */
  bbl: string;
};
/**
 * @description An object containing zoning district class schemas.
 */
export type FindZoningDistrictClassesByTaxLotBbl200 = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
/**
 * @description Invalid client request
 */
export type FindZoningDistrictClassesByTaxLotBbl400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindZoningDistrictClassesByTaxLotBbl404 = Error;
/**
 * @description Server side error
 */
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
export type FindZoningDistrictClassesByTaxLotBblQuery = {
  Response: FindZoningDistrictClassesByTaxLotBblQueryResponse;
  PathParams: FindZoningDistrictClassesByTaxLotBblPathParams;
  Errors:
    | FindZoningDistrictClassesByTaxLotBbl400
    | FindZoningDistrictClassesByTaxLotBbl404
    | FindZoningDistrictClassesByTaxLotBbl500;
};
