import type { TaxLotGeoJson } from "./TaxLotGeoJson";
import type { Error } from "./Error";

export type FindTaxLotGeoJsonByBblPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
  /**
   * @description A multi-character numeric string containing the common number used to refer to the block of a bbl.
   * @type string
   */
  blockId: string;
  /**
   * @description A multi-character numeric string containing the common number used to refer to the lot of a bbl.
   * @type string
   */
  lotId: string;
};
/**
 * @description A tax lot geojson object
 */
export type FindTaxLotGeoJsonByBbl200 = TaxLotGeoJson;
/**
 * @description Invalid client request
 */
export type FindTaxLotGeoJsonByBbl400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindTaxLotGeoJsonByBbl404 = Error;
/**
 * @description Server side error
 */
export type FindTaxLotGeoJsonByBbl500 = Error;
/**
 * @description A tax lot geojson object
 */
export type FindTaxLotGeoJsonByBblQueryResponse = TaxLotGeoJson;
export type FindTaxLotGeoJsonByBblQuery = {
  Response: FindTaxLotGeoJsonByBblQueryResponse;
  PathParams: FindTaxLotGeoJsonByBblPathParams;
  Errors:
    | FindTaxLotGeoJsonByBbl400
    | FindTaxLotGeoJsonByBbl404
    | FindTaxLotGeoJsonByBbl500;
};
