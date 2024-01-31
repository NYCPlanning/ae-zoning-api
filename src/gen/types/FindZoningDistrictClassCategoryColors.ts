import type { Error } from "./Error";
import type { ZoningDistrictClassCategoryColor } from "./ZoningDistrictClassCategoryColor";

export type FindZoningDistrictClassCategoryColors400 = Error;

export type FindZoningDistrictClassCategoryColors500 = Error;

/**
 * @description An object containing all zoning district category colors.
 */
export type FindZoningDistrictClassCategoryColorsQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClassCategoryColors: ZoningDistrictClassCategoryColor[];
};
