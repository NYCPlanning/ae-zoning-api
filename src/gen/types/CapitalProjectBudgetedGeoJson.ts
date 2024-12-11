import type { MultiPoint } from "./MultiPoint";
import type { MultiPolygon } from "./MultiPolygon";
import type { CapitalProjectBudgeted } from "./CapitalProjectBudgeted";

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
