import type { Error } from "./Error";
import type { LandUse } from "./LandUse";

export type GetLandUses400 = Error;

export type GetLandUses500 = Error;

/**
 * @description An object containing all land uses.
 */
export type GetLandUsesQueryResponse = {
  /**
   * @type array
   */
  landUses: LandUse[];
};
