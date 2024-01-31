import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type FindZoningDistrictClasses400 = Error;

export type FindZoningDistrictClasses500 = Error;

/**
 * @description An object containing all zoning district class schemas.
 */
export type FindZoningDistrictClassesQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
