export type ZoningDistrict = {
  /**
   * @description An automatically generated uuid.
   * @type string uuid
   * @example d1c09f3a-553b-4574-811e-abd59d19e01b
   */
  id: string;
  /**
   * @description The zoning codes that apply to the district. Multiple codes are concatenated with a slash.
   * @type string
   * @example M1-5/R7-3
   */
  label: string;
};
