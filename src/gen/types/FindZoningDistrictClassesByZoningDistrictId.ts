import type { ZoningDistrictClass } from "./ZoningDistrictClass";
import type { Error } from "./Error";

export type FindZoningDistrictClassesByZoningDistrictIdPathParams = {
  /**
   * @type string, uuid
   */
  id: string;
};
/**
 * @description An object of class schemas for the zoning district.
 */
export type FindZoningDistrictClassesByZoningDistrictId200 = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
/**
 * @description Invalid client request
 */
export type FindZoningDistrictClassesByZoningDistrictId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindZoningDistrictClassesByZoningDistrictId404 = Error;
/**
 * @description Server side error
 */
export type FindZoningDistrictClassesByZoningDistrictId500 = Error;
/**
 * @description An object of class schemas for the zoning district.
 */
export type FindZoningDistrictClassesByZoningDistrictIdQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
export type FindZoningDistrictClassesByZoningDistrictIdQuery = {
  Response: FindZoningDistrictClassesByZoningDistrictIdQueryResponse;
  PathParams: FindZoningDistrictClassesByZoningDistrictIdPathParams;
  Errors:
    | FindZoningDistrictClassesByZoningDistrictId400
    | FindZoningDistrictClassesByZoningDistrictId404
    | FindZoningDistrictClassesByZoningDistrictId500;
};
