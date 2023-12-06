import type { TaxLotGeoJson } from "./TaxLotGeoJson";

export type GetTaxLotGeoJsonByBblPathParams = {
  /**
   * @type string
   */
  bbl: string;
};

/**
 * @description A tax lot geojson object
 */
export type GetTaxLotGeoJsonByBblQueryResponse = TaxLotGeoJson;
