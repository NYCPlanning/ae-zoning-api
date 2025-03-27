import type { Agency } from "./Agency";
import type { Error } from "./Error";

/**
 * @description An object containing all agencies sorted alphabetically by the agency initials.\n
 */
export type FindAgencies200 = {
  /**
   * @description An list of agencies sorted alphabetically by the agency initials.\n
   * @type array
   */
  agencies: Agency[];
  /**
   * @description The criteria used to sort the results using the agency initials in ascending order.
   * @type string
   */
  order: string;
};
/**
 * @description Invalid client request
 */
export type FindAgencies400 = Error;
/**
 * @description Server side error
 */
export type FindAgencies500 = Error;
/**
 * @description An object containing all agencies sorted alphabetically by the agency initials.\n
 */
export type FindAgenciesQueryResponse = {
  /**
   * @description An list of agencies sorted alphabetically by the agency initials.\n
   * @type array
   */
  agencies: Agency[];
  /**
   * @description The criteria used to sort the results using the agency initials in ascending order.
   * @type string
   */
  order: string;
};
export type FindAgenciesQuery = {
  Response: FindAgenciesQueryResponse;
  Errors: FindAgencies400 | FindAgencies500;
};
