import type { LandUse } from "./LandUse";

/**
 * @description An array of land use objects.
 */
export type GetLandUsesQueryResponse = {
  /**
   * @type array | undefined
   */
  landUses?: LandUse[];
};
