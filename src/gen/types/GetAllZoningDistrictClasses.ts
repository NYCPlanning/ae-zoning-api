import type { ZoningDistrictClass } from "./ZoningDistrictClass";

/**
 * @description An array of all zoning district class schemas
 */
export type GetAllZoningDistrictClassesQueryResponse = {
  /**
   * @type array | undefined
   */
  zoningDistrictClasses?: ZoningDistrictClass[];
};
