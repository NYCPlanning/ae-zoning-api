import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetAllZoningDistrictClasses400 = Error;

export type GetAllZoningDistrictClasses500 = Error;

/**
 * @description An object containing all zoning district class schemas.
 */
export type GetAllZoningDistrictClassesQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
