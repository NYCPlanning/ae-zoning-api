import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type FindZoningDistrictClassByZoningDistrictClassIdPathParams = {
  /**
   * @type string
   */
  id: string;
};

export type FindZoningDistrictClassByZoningDistrictClassId400 = Error;

export type FindZoningDistrictClassByZoningDistrictClassId404 = Error;

export type FindZoningDistrictClassByZoningDistrictClassId500 = Error;

/**
 * @description A class schema for a zoning district
 */
export type FindZoningDistrictClassByZoningDistrictClassIdQueryResponse =
  ZoningDistrictClass;
