import type { MultiPoint } from "./MultiPoint";
import type { MultiPolygon } from "./MultiPolygon";
import type { CommunityBoardBudgetRequest } from "./CommunityBoardBudgetRequest";

export const communityBoardBudgetRequestGeoJsonType = {
  Feature: "Feature",
} as const;
export type CommunityBoardBudgetRequestGeoJsonType =
  (typeof communityBoardBudgetRequestGeoJsonType)[keyof typeof communityBoardBudgetRequestGeoJsonType];
export type CommunityBoardBudgetRequestGeoJson = {
  /**
   * @description The id for the community board budget request.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: CommunityBoardBudgetRequestGeoJsonType;
  geometry: MultiPoint | MultiPolygon;
  /**
   * @type object
   */
  properties: CommunityBoardBudgetRequest;
};
