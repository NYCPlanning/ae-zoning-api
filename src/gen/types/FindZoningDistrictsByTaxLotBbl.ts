import type { ZoningDistrict } from "./ZoningDistrict";
import type { Error } from "./Error";

export type FindZoningDistrictsByTaxLotBblPathParams = {
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
 * @description An object containing zoning districts.
 */
export type FindZoningDistrictsByTaxLotBbl200 = {
  /**
   * @type array
   */
  zoningDistricts: ZoningDistrict[];
};
/**
 * @description Invalid client request
 */
export type FindZoningDistrictsByTaxLotBbl400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindZoningDistrictsByTaxLotBbl404 = Error;
/**
 * @description Server side error
 */
export type FindZoningDistrictsByTaxLotBbl500 = Error;
/**
 * @description An object containing zoning districts.
 */
export type FindZoningDistrictsByTaxLotBblQueryResponse = {
  /**
   * @type array
   */
  zoningDistricts: ZoningDistrict[];
};
export type FindZoningDistrictsByTaxLotBblQuery = {
  Response: FindZoningDistrictsByTaxLotBblQueryResponse;
  PathParams: FindZoningDistrictsByTaxLotBblPathParams;
  Errors:
    | FindZoningDistrictsByTaxLotBbl400
    | FindZoningDistrictsByTaxLotBbl404
    | FindZoningDistrictsByTaxLotBbl500;
};
