import type { CommunityDistrict } from "./CommunityDistrict";
import type { MultiPolygon } from "./MultiPolygon";

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
  /**
   * @type object
   */
  properties: CommunityDistrict;
  /**
   * @type object
   */
  geometry: MultiPolygon;
};
