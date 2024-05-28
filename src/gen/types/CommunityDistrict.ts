export type CommunityDistrict = {
  /**
   * @description The two character numeric string containing the number used to refer to the community district.
   * @type string
   * @example 1
   */
  id: string;
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   * @example 1
   */
  boroughId: string;
};
