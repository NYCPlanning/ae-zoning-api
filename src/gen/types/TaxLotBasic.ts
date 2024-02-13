export type TaxLotBasic = {
  /**
   * @description The ten character code compromised of a one character borough, five character block, and four character lot codes.
   * @type string
   * @example 1000477501
   */
  bbl: string;
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   * @example 1
   */
  boroughId: string;
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
  /**
   * @description The two character code to represent the land use. Possible values are 01-11.
   * @type string
   * @example 05
   */
  landUseId: string;
};
