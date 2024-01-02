import type { Bbl } from "./Bbl";
import type { Borough } from "./Borough";
import type { LandUse } from "./LandUse";

export type TaxLot = {
  bbl: Bbl;
  borough: Borough;
  /**
   * @description The block code, without its padding zeros.
   * @type string
   * @example 47
   */
  block: string;
  /**
   * @description The lot code, without its padding zeros.
   * @type string
   * @example 7501
   */
  lot: string;
  /**
   * @description The street address.
   * @type string
   * @example 120 BROADWAY
   */
  address: string;
  landUse: LandUse;
};
