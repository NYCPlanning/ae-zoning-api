import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByUuidPathParams = {
  /**
   * @type string uuid
   */
  uuid: string;
};

export type GetZoningDistrictClassesByUuid400 = Error;

export type GetZoningDistrictClassesByUuid404 = Error;

export type GetZoningDistrictClassesByUuid500 = Error;

/**
 * @description An object of class schemas for the zoning district.
 */
export type GetZoningDistrictClassesByUuidQueryResponse = {
  /**
   * @type array
   */
  zoningDistrictClasses: ZoningDistrictClass[];
};
