import type { ZoningDistrictClass } from "./ZoningDistrictClass";

export type GetZoningDistrictClassesByIdPathParams = {
  /**
   * @type string
   */
  id: string;
};

/**
 * @description A class schema for a zoning district
 */
export type GetZoningDistrictClassesByIdQueryResponse = ZoningDistrictClass;
