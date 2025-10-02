import type { Agency } from "./Agency";
import type { Error } from "./Error";

/**
 * @description An object containing capital project managing agencies\n
 */
export type FindCapitalProjectManagingAgencies200 = {
  /**
   * @description An list of agencies sorted alphabetically by the agency initials.\n
   * @type array
   */
  managingAgencies: Agency[];
  /**
   * @description The criteria used to sort the results using the agency initials in ascending order.
   * @type string
   */
  order: string;
};
/**
 * @description Invalid client request
 */
export type FindCapitalProjectManagingAgencies400 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectManagingAgencies500 = Error;
/**
 * @description An object containing capital project managing agencies\n
 */
export type FindCapitalProjectManagingAgenciesQueryResponse = {
  /**
   * @description An list of agencies sorted alphabetically by the agency initials.\n
   * @type array
   */
  managingAgencies: Agency[];
  /**
   * @description The criteria used to sort the results using the agency initials in ascending order.
   * @type string
   */
  order: string;
};
export type FindCapitalProjectManagingAgenciesQuery = {
  Response: FindCapitalProjectManagingAgenciesQueryResponse;
  Errors:
    | FindCapitalProjectManagingAgencies400
    | FindCapitalProjectManagingAgencies500;
};
