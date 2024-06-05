import type { CapitalProjectCategory } from "./CapitalProjectCategory";

export type CapitalProject = {
  /**
   * @description The id for the project, which combines with the managing code to make a unique id
   * @type string
   * @example HWPEDSF5
   */
  id: string;
  /**
   * @description The capital project title.
   * @type string
   * @example Multi-Site Pedestrian Safety Phase 5
   */
  description: string;
  /**
   * @description Three character string of numbers representing managing agency
   * @type string
   * @example 850
   */
  managingCode: string;
  /**
   * @description The managing agency name abbreviation or acronym
   * @type string
   * @example DOT
   */
  managingAgencyInitials: string;
  /**
   * @description The starting date of the capital project
   * @type string date
   * @example 2024-05-15
   */
  minDate: string;
  /**
   * @description The ending date of the capital project
   * @type string date
   * @example 2024-05-15
   */
  maxDate: string;
  category: CapitalProjectCategory;
};
