import type { ZoningDistrict } from "./ZoningDistrict";

export type GetZoningDistrictByIdPathParams = {
  /**
   * @type string uuid
   */
  id: string;
};

/**
 * @description A zoning district object
 */
export type GetZoningDistrictByIdQueryResponse = ZoningDistrict;
