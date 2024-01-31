import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type FindZoningDistrictClassesByZoningDistrictIdPathParams = {
  /**
   * @type string uuid
   */
  id: string;
};

export type FindZoningDistrictClassesByZoningDistrictId400 = Error;

export type FindZoningDistrictClassesByZoningDistrictId404 = Error;

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
