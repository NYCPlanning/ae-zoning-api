import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type FindZoningDistrictClassByZoningDistrictClassIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
/**
 * @description A class schema for a zoning district
 */
export type FindZoningDistrictClassByZoningDistrictClassId200 =
  ZoningDistrictClass;
/**
 * @description Invalid client request
 */
export type FindZoningDistrictClassByZoningDistrictClassId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindZoningDistrictClassByZoningDistrictClassId404 = Error;
/**
 * @description Server side error
 */
export type FindZoningDistrictClassByZoningDistrictClassId500 = Error;
/**
 * @description A class schema for a zoning district
 */
export type FindZoningDistrictClassByZoningDistrictClassIdQueryResponse =
  ZoningDistrictClass;
export type FindZoningDistrictClassByZoningDistrictClassIdQuery = {
  Response: FindZoningDistrictClassByZoningDistrictClassIdQueryResponse;
  PathParams: FindZoningDistrictClassByZoningDistrictClassIdPathParams;
  Errors:
    | FindZoningDistrictClassByZoningDistrictClassId400
    | FindZoningDistrictClassByZoningDistrictClassId404
    | FindZoningDistrictClassByZoningDistrictClassId500;
};
