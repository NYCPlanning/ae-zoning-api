import { CityCouncilDistrict } from "./CityCouncilDistrict";
import { MultiPolygon } from "./MultiPolygon";

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
  properties: CityCouncilDistrict;
  geometry: MultiPolygon;
};
