import { Position } from "./Position";

export const multiPointType = {
  MultiPoint: "MultiPoint",
} as const;
export type MultiPointType =
  (typeof multiPointType)[keyof typeof multiPointType];
/**
 * @description A geojson implementation of a MultiPoint Simple Feature
 */
export type MultiPoint = {
  /**
   * @type string
   */
  type: MultiPointType;
  /**
   * @description Array of position coordinate arrays.
   * @type array
   */
  coordinates: Position[];
};
