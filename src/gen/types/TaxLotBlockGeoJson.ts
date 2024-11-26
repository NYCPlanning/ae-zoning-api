import type { MultiPolygon } from "./MultiPolygon";

export const taxLotBlockGeoJsonType = {
  Feature: "Feature",
} as const;
export type TaxLotBlockGeoJsonType =
  (typeof taxLotBlockGeoJsonType)[keyof typeof taxLotBlockGeoJsonType];
export type TaxLotBlockGeoJson = {
  /**
   * @description The concatenated borough and block ids of the tax lot.
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  type: TaxLotBlockGeoJsonType;
  /**
   * @type object
   */
  geometry: MultiPolygon;
  /**
   * @type object
   */
  properties: {
    /**
     * @description The block code for the bbl
     * @type string
     */
    boroughId: string;
    /**
     * @description The block code for the bbl
     * @type string
     */
    blockId: string;
  };
};
