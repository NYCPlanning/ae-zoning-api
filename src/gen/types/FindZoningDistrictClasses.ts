import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

/**
 * @description An object containing all zoning district class schemas.
 */
export type FindZoningDistrictClasses200 = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
/**
 * @description Invalid client request
 */
export type FindZoningDistrictClasses400 = Error;
/**
 * @description Server side error
 */
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
export type FindZoningDistrictClassesQuery = {
  Response: FindZoningDistrictClassesQueryResponse;
  Errors: FindZoningDistrictClasses400 | FindZoningDistrictClasses500;
};
