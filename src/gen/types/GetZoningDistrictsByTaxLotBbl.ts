import type { ZoningDistrict } from "./ZoningDistrict";

export type GetZoningDistrictsByTaxLotBblPathParams = {
  /**
   * @type string
   */
  bbl: string;
};

/**
 * @description An array of zoning district objects
 */
export type GetZoningDistrictsByTaxLotBblQueryResponse = {
  /**
   * @type array | undefined
   */
  zoningDistricts?: ZoningDistrict[];
};
