import type { Error } from "./Error";
import type { ZoningDistrict } from "./ZoningDistrict";

export type FindZoningDistrictsByTaxLotBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type FindZoningDistrictsByTaxLotBbl400 = Error;

export type FindZoningDistrictsByTaxLotBbl404 = Error;

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
