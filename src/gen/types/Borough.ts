export type Borough = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   * @example 1
   */
  id: string;
  /**
   * @description The full name of the borough.
   * @type string
   * @example Manhattan
   */
  title: string;
  /**
   * @description The two character abbreviation for the borough.
   * @type string
   * @example MN
   */
  abbr: string;
};
