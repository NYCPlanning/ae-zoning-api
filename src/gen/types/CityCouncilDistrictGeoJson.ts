import type { CityCouncilDistrict } from "./CityCouncilDistrict";
import type { MultiPolygon } from "./MultiPolygon";

export const cityCouncilDistrictGeoJsonType = {
  Feature: "Feature",
} as const;
export type CityCouncilDistrictGeoJsonType =
  (typeof cityCouncilDistrictGeoJsonType)[keyof typeof cityCouncilDistrictGeoJsonType];
export type CityCouncilDistrictGeoJson = {
  /**
   * @description One or two character code to represent city council districts.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: CityCouncilDistrictGeoJsonType;
  /**
   * @type object
   */
  properties: CityCouncilDistrict;
  /**
   * @type object
   */
  geometry: MultiPolygon;
};
