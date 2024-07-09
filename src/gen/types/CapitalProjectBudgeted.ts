import { CapitalProject } from "./CapitalProject";

export type CapitalProjectBudgeted = CapitalProject & {
  /**
   * @description The sum total of commitments for the capital project
   * @type number
   */
  commitmentsTotal: number;
  /**
   * @description An array containing string values representing the sponsoring agencies initials.
   * @type array
   */
  sponsoringAgencies: string[];
  /**
   * @description An array containing string values representing the budget types.
   * @type array
   */
  budgetTypes: string[];
};
