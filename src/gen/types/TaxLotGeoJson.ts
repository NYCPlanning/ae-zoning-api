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
   * @type string | undefined
   * @example 1000477501
   */
  id?: string;
  /**
   * @type string | undefined
   */
  type?: TaxLotGeoJsonType;
  geometry?: MultiPolygon;
  properties?: TaxLot;
};
