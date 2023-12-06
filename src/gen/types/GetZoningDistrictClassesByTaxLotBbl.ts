import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByTaxLotBblPathParams = {
  /**
   * @type string
   */
  bbl: string;
};

/**
 * @description An array of zoning district class schemas
 */
export type GetZoningDistrictClassesByTaxLotBblQueryResponse = {
  /**
   * @type array | undefined
   */
  zoningDistrictClasses?: ZoningDistrictClass[];
};
