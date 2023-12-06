export type LandUse = {
  /**
   * @description The two character code to represent the land use. Possible values are 01-11.
   * @type string
   * @example 05
   */
  id: string;
  /**
   * @description The description of the land use.
   * @type string
   * @example Commercial and Office Buildings
   */
  description: string;
  /**
   * @description Hex-style color code to represent the land use.
   * @type string
   * @example #fc2929ff
   */
  color: string;
};
