import type { Error } from "./Error";
import type { TaxLotGeoJson } from "./TaxLotGeoJson";

export type FindTaxLotGeoJsonByBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type FindTaxLotGeoJsonByBbl400 = Error;

export type FindTaxLotGeoJsonByBbl404 = Error;

export type FindTaxLotGeoJsonByBbl500 = Error;

/**
 * @description A tax lot geojson object
 */
export type FindTaxLotGeoJsonByBblQueryResponse = TaxLotGeoJson;
