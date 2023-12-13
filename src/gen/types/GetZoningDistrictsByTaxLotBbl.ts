import type { Error } from "./Error";
import type { ZoningDistrict } from "./ZoningDistrict";

export type GetZoningDistrictsByTaxLotBblPathParams = {
  /**
   * @type string
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
