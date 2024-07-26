import { CommunityDistrict } from "./CommunityDistrict";
import { MultiPolygon } from "./MultiPolygon";

export const communityDistrictGeoJsonType = {
  Feature: "Feature",
} as const;
export type CommunityDistrictGeoJsonType =
  (typeof communityDistrictGeoJsonType)[keyof typeof communityDistrictGeoJsonType];
export type CommunityDistrictGeoJson = {
  /**
   * @description Three character code to represent a borough and community district.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: CommunityDistrictGeoJsonType;
  properties: CommunityDistrict;
  geometry: MultiPolygon;
};
