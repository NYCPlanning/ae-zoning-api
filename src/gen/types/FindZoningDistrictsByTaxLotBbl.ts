import type { ZoningDistrict } from "./ZoningDistrict";
import type { Error } from "./Error";

export type FindZoningDistrictsByTaxLotBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   */
  bbl: string;
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
