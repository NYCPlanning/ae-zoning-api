import { CapitalProjectCategory } from "./CapitalProjectCategory";

export type CapitalProject = {
  /**
   * @description The id for the project, which combines with the managing code to make a unique id
   * @type string
   */
  id: string;
  /**
   * @description The capital project title.
   * @type string
   */
  description: string;
  /**
   * @description Three character string of numbers representing managing agency
   * @type string
   */
  managingCode: string;
  /**
   * @description The managing agency name abbreviation or acronym
   * @type string
   */
  managingAgencyInitials: string;
  /**
   * @description The starting date of the capital project
   * @type string, date
   */
  minDate: string;
  /**
   * @description The ending date of the capital project
   * @type string, date
   */
  maxDate: string;
  category: CapitalProjectCategory;
};
