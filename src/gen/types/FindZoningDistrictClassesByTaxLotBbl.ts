import type { ZoningDistrictClass } from "./ZoningDistrictClass";
import type { Error } from "./Error";

export type FindZoningDistrictClassesByTaxLotBblPathParams = {
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
