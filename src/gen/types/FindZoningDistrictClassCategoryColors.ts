import type { Error } from "./Error";
import type { ZoningDistrictClassCategoryColor } from "./ZoningDistrictClassCategoryColor";

/**
 * @description An object containing all zoning district category colors.
 */
export type FindZoningDistrictClassCategoryColors200 = {
  /**
   * @type array
   */
  zoningDistrictClassCategoryColors: ZoningDistrictClassCategoryColor[];
};
/**
 * @description Invalid client request
 */
export type FindZoningDistrictClassCategoryColors400 = Error;
/**
 * @description Server side error
 */
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
export type FindZoningDistrictClassCategoryColorsQuery = {
  Response: FindZoningDistrictClassCategoryColorsQueryResponse;
  Errors:
    | FindZoningDistrictClassCategoryColors400
    | FindZoningDistrictClassCategoryColors500;
};
