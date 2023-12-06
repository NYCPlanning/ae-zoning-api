import type { ZoningDistrictClassCategory } from "./ZoningDistrictClassCategory";

export type ZoningDistrictClass = {
  /**
   * @description The code associated with the Zoning class.
   * @type string | undefined
   * @example M1
   */
  id?: string;
  category?: ZoningDistrictClassCategory;
  /**
   * @description Zoning class descriptions.
   * @type string | undefined
   */
  description?: string;
  /**
   * @description Planning website page that explains the Zoning District
   * @type string | undefined
   */
  url?: string;
  /**
   * @description Zoning classes from layer groups.
   * @type string | undefined
   * @example #f3b3ffff
   */
  color?: string;
};
