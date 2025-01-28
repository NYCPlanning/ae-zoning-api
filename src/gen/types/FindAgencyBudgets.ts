import type { AgencyBudget } from "./AgencyBudget";
import type { Error } from "./Error";

/**
 * @description An object containing all agency budgets.
 */
export type FindAgencyBudgets200 = {
  /**
   * @type array
   */
  agencyBudgets: AgencyBudget[];
  /**
   * @description Agency Budgets are sorted alphabetically by their codes
   * @type string
   */
  order: string;
};
/**
 * @description Invalid client request
 */
export type FindAgencyBudgets400 = Error;
/**
 * @description Server side error
 */
export type FindAgencyBudgets500 = Error;
/**
 * @description An object containing all agency budgets.
 */
export type FindAgencyBudgetsQueryResponse = {
  /**
   * @type array
   */
  agencyBudgets: AgencyBudget[];
  /**
   * @description Agency Budgets are sorted alphabetically by their codes
   * @type string
   */
  order: string;
};
export type FindAgencyBudgetsQuery = {
  Response: FindAgencyBudgetsQueryResponse;
  Errors: FindAgencyBudgets400 | FindAgencyBudgets500;
};
