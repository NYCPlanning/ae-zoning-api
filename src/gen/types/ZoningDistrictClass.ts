import type { ZoningDistrictClassCategory } from "./ZoningDistrictClassCategory";

export type ZoningDistrictClass = {
  /**
   * @description The code associated with the Zoning class.
   * @type string
   * @example M1
   */
  id: string;
  category: ZoningDistrictClassCategory;
  /**
   * @description Zoning class descriptions.
   * @type string
   */
  description: string;
  /**
   * @description Planning website page that explains the Zoning District
   * @type string
   */
  url: string;
  /**
   * @description Zoning classes from layer groups.
   * @type string
   * @example #f3b3ffff
   */
  color: string;
};
