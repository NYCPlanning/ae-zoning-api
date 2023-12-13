import type { Error } from "./Error";
import type { ZoningDistrict } from "./ZoningDistrict";

export type GetZoningDistrictByIdPathParams = {
  /**
   * @type string uuid
   */
  id: string;
};

export type GetZoningDistrictById400 = Error;

export type GetZoningDistrictById404 = Error;

export type GetZoningDistrictById500 = Error;

/**
 * @description A zoning district object
 */
export type GetZoningDistrictByIdQueryResponse = ZoningDistrict;
