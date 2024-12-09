import type { MultiPolygon } from "./MultiPolygon";
import type { Borough } from "./Borough";

export const boroughGeoJsonType = {
  Feature: "Feature",
} as const;
export type BoroughGeoJsonType =
  (typeof boroughGeoJsonType)[keyof typeof boroughGeoJsonType];
export type BoroughGeoJson = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: BoroughGeoJsonType;
  /**
   * @type object
   */
  geometry: MultiPolygon;
  /**
   * @type object
   */
  properties: Borough;
};
