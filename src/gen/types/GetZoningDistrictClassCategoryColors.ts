import type { Error } from "./Error";
import type { ZoningDistrictClassCategoryColor } from "./ZoningDistrictClassCategoryColor";

export type GetZoningDistrictClassCategoryColors400 = Error;

export type GetZoningDistrictClassCategoryColors500 = Error;

/**
 * @description An object containing all zoning district category colors.
 */
export type GetZoningDistrictClassCategoryColorsQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClassCategoryColors: ZoningDistrictClassCategoryColor[];
};
