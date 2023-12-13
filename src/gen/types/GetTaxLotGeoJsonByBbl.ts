import type { Error } from "./Error";
import type { TaxLotGeoJson } from "./TaxLotGeoJson";

export type GetTaxLotGeoJsonByBblPathParams = {
  /**
   * @type string
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
