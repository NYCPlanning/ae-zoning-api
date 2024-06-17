export type LandUse = {
  /**
   * @description The two character code to represent the land use. Possible values are 01-11.
   * @type string
   */
  id: string;
  /**
   * @description The description of the land use.
   * @type string
   */
  description: string;
  /**
   * @description Hex-style color code to represent the land use.
   * @type string
   */
  color: string;
};
