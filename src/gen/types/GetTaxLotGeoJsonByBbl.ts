import type { Error } from "./Error";
import type { Bbl } from "./Bbl";
import type { TaxLotGeoJson } from "./TaxLotGeoJson";

export type GetTaxLotGeoJsonByBbl400 = Error;

export type GetTaxLotGeoJsonByBbl404 = Error;

export type GetTaxLotGeoJsonByBbl500 = Error;

export type GetTaxLotGeoJsonByBblPathParams = {
  bbl: Bbl;
};

/**
 * @description A tax lot geojson object
 */
export type GetTaxLotGeoJsonByBblQueryResponse = TaxLotGeoJson;
