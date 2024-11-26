export type TaxLotBasic = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
  /**
   * @description The block code for the bbl
   * @type string
   */
  blockId: string;
  /**
   * @description The lot code for the bbl
   * @type string
   */
  lotId: string;
  /**
   * @description The street address.
   * @type string
   */
  address: string | null;
  /**
   * @description The two character code to represent the land use. Possible values are 01-11.
   * @type string
   */
  landUseId: string | null;
};
