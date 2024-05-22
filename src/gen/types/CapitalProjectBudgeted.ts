import type { CapitalProject } from "./CapitalProject";

export type CapitalProjectBudgeted = CapitalProject & {
  /**
   * @description The sum total of commitments for the capital project
   * @type number
   * @example 200000
   */
  commitmentsTotal: number;
  /**
   * @description An array containing string values representing the sponsoring agencies initials.
   * @type array
   * @example DOT
   */
  sponsoringAgencyInitials: string[];
  /**
   * @description An array containing string values representing the budget types.
   * @type array
   * @example Highways,Highway Bridges
   */
  budgetType: string[];
};
