import type { Error } from "./Error";
import type { TaxLotGeoJson } from "./TaxLotGeoJson";

export type FindTaxLotGeoJsonByBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   */
  bbl: string;
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
