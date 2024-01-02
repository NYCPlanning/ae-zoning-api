import type { Error } from "./Error";
import type { Bbl } from "./Bbl";
import type { ZoningDistrict } from "./ZoningDistrict";

export type GetZoningDistrictsByTaxLotBbl400 = Error;

export type GetZoningDistrictsByTaxLotBbl404 = Error;

export type GetZoningDistrictsByTaxLotBbl500 = Error;

export type GetZoningDistrictsByTaxLotBblPathParams = {
  bbl: Bbl;
};

/**
 * @description An object containing zoning districts.
 */
export type GetZoningDistrictsByTaxLotBblQueryResponse = {
  /**
   * @type array
   */
  zoningDistricts: ZoningDistrict[];
};
