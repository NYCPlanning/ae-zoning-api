import type { MultiPolygon } from "./MultiPolygon";
import type { TaxLot } from "./TaxLot";

export const taxLotGeoJsonType = {
  Feature: "Feature",
} as const;
export type TaxLotGeoJsonType =
  (typeof taxLotGeoJsonType)[keyof typeof taxLotGeoJsonType];
export type TaxLotGeoJson = {
  /**
   * @description The bbl of the tax lot.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: TaxLotGeoJsonType;
  /**
   * @type object
   */
  geometry: MultiPolygon;
  /**
   * @type object
   */
  properties: TaxLot;
};
