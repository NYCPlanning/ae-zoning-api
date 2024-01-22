import type { Error } from "./Error";
import type { LandUse } from "./LandUse";

export type FindLandUses400 = Error;

export type FindLandUses500 = Error;

/**
 * @description An object containing all land uses.
 */
export type FindLandUsesQueryResponse = {
  /**
   * @type array
   */
  landUses: LandUse[];
};
