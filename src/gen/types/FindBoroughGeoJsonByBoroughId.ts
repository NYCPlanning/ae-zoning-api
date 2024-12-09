import type { BoroughGeoJson } from "./BoroughGeoJson";
import type { Error } from "./Error";

export type FindBoroughGeoJsonByBoroughIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
};
/**
 * @description A borough geojson object
 */
export type FindBoroughGeoJsonByBoroughId200 = BoroughGeoJson;
/**
 * @description Invalid client request
 */
export type FindBoroughGeoJsonByBoroughId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindBoroughGeoJsonByBoroughId404 = Error;
/**
 * @description Server side error
 */
export type FindBoroughGeoJsonByBoroughId500 = Error;
/**
 * @description A borough geojson object
 */
export type FindBoroughGeoJsonByBoroughIdQueryResponse = BoroughGeoJson;
export type FindBoroughGeoJsonByBoroughIdQuery = {
  Response: FindBoroughGeoJsonByBoroughIdQueryResponse;
  PathParams: FindBoroughGeoJsonByBoroughIdPathParams;
  Errors:
    | FindBoroughGeoJsonByBoroughId400
    | FindBoroughGeoJsonByBoroughId404
    | FindBoroughGeoJsonByBoroughId500;
};
