import type { Borough } from "./Borough";
import type { LandUse } from "./LandUse";

export type TaxLot = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   */
  bbl: string;
  /**
   * @type object
   */
  borough: Borough;
  /**
   * @description The block code, without its padding zeros.
   * @type string
   */
  block: string;
  /**
   * @description The lot code, without its padding zeros.
   * @type string
   */
  lot: string;
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
