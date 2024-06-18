import type { Error } from "./Error";
import type { ZoningDistrict } from "./ZoningDistrict";

export type FindZoningDistrictByZoningDistrictIdPathParams = {
  /**
   * @type string, uuid
   */
  id: string;
};
/**
 * @description A zoning district object
 */
export type FindZoningDistrictByZoningDistrictId200 = ZoningDistrict;
/**
 * @description Invalid client request
 */
export type FindZoningDistrictByZoningDistrictId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindZoningDistrictByZoningDistrictId404 = Error;
/**
 * @description Server side error
 */
export type FindZoningDistrictByZoningDistrictId500 = Error;
/**
 * @description A zoning district object
 */
export type FindZoningDistrictByZoningDistrictIdQueryResponse = ZoningDistrict;
export type FindZoningDistrictByZoningDistrictIdQuery = {
  Response: FindZoningDistrictByZoningDistrictIdQueryResponse;
  PathParams: FindZoningDistrictByZoningDistrictIdPathParams;
  Errors:
    | FindZoningDistrictByZoningDistrictId400
    | FindZoningDistrictByZoningDistrictId404
    | FindZoningDistrictByZoningDistrictId500;
};
