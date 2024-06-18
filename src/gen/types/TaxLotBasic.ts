export type TaxLotBasic = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   */
  bbl: string;
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
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
   * @description The two character code to represent the land use. Possible values are 01-11.
   * @type string
   */
  landUseId: string;
};
