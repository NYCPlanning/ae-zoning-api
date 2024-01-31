import type { Error } from "./Error";
import type { ZoningDistrict } from "./ZoningDistrict";

export type FindZoningDistrictByZoningDistrictIdPathParams = {
  /**
   * @type string uuid
   */
  id: string;
};

export type FindZoningDistrictByZoningDistrictId400 = Error;

export type FindZoningDistrictByZoningDistrictId404 = Error;

export type FindZoningDistrictByZoningDistrictId500 = Error;

/**
 * @description A zoning district object
 */
export type FindZoningDistrictByZoningDistrictIdQueryResponse = ZoningDistrict;
