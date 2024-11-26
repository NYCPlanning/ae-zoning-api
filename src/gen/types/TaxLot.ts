import type { Borough } from "./Borough";
import type { LandUse } from "./LandUse";

export type TaxLot = {
  /**
   * @type object
   */
  borough: Borough;
  /**
   * @description The block code for the bbl
   * @type string | undefined
   */
  blockId?: string;
  /**
   * @description The lot code for the bbl
   * @type string | undefined
   */
  lotId?: string;
  /**
   * @description The street address.
   * @type string
   */
  address: string;
  /**
   * @type object
   */
  landUse: LandUse;
};
