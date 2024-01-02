import type { Error } from "./Error";
import type { TaxLotGeoJson } from "./TaxLotGeoJson";

export type GetTaxLotGeoJsonByBblPathParams = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
};

export type GetTaxLotGeoJsonByBbl400 = Error;

export type GetTaxLotGeoJsonByBbl404 = Error;

export type GetTaxLotGeoJsonByBbl500 = Error;

/**
 * @description A tax lot geojson object
 */
export type GetTaxLotGeoJsonByBblQueryResponse = TaxLotGeoJson;
