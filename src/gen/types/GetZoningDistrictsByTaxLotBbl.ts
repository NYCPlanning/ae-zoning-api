import type { Error } from "./Error";
import type { ZoningDistrict } from "./ZoningDistrict";

export type GetZoningDistrictsByTaxLotBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type GetZoningDistrictsByTaxLotBbl400 = Error;

export type GetZoningDistrictsByTaxLotBbl404 = Error;

export type GetZoningDistrictsByTaxLotBbl500 = Error;

/**
 * @description An object containing zoning districts.
 */
export type GetZoningDistrictsByTaxLotBblQueryResponse = {
  /**
   * @type array
   */
  zoningDistricts: ZoningDistrict[];
};
