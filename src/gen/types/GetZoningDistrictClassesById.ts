import type { Error } from "./Error";
import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByIdPathParams = {
  /**
   * @type string
   */
  id: string;
};

export type GetZoningDistrictClassesById400 = Error;

export type GetZoningDistrictClassesById404 = Error;

export type GetZoningDistrictClassesById500 = Error;

/**
 * @description A class schema for a zoning district
 */
export type GetZoningDistrictClassesByIdQueryResponse = ZoningDistrictClass;
