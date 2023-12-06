import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByUuidPathParams = {
  /**
   * @type string uuid
   */
  uuid: string;
};

/**
 * @description An array of class schemas for the zoning district
 */
export type GetZoningDistrictClassesByUuidQueryResponse = {
  /**
   * @type array | undefined
   */
  zoningDistrictClasses?: ZoningDistrictClass[];
};
