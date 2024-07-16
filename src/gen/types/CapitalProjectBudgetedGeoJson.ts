import { MultiPoint } from "./MultiPoint";
import { MultiPolygon } from "./MultiPolygon";
import { CapitalProjectBudgeted } from "./CapitalProjectBudgeted";

export const capitalProjectBudgetedGeoJsonType = {
  Feature: "Feature",
} as const;
export type CapitalProjectBudgetedGeoJsonType =
  (typeof capitalProjectBudgetedGeoJsonType)[keyof typeof capitalProjectBudgetedGeoJsonType];
export type CapitalProjectBudgetedGeoJson = {
  /**
   * @description The concatenation of the managing code and capital project id.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: CapitalProjectBudgetedGeoJsonType;
  geometry: MultiPoint | MultiPolygon;
  properties: CapitalProjectBudgeted;
};
