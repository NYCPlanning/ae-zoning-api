export type ZoningDistrict = {
  /**
   * @description An automatically generated uuid.
   * @type string, uuid
   */
  id: string;
  /**
   * @description The zoning codes that apply to the district. Multiple codes are concatenated with a slash.
   * @type string
   */
  label: string;
};
