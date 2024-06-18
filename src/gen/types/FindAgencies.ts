import type { Error } from "./Error";
import type { Agency } from "./Agency";

/**
 * @description An object containing all agencies.
 */
export type FindAgencies200 = {
  /**
   * @type array
   */
  agencies: Agency[];
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
 * @description An object containing all agencies.
 */
export type FindAgenciesQueryResponse = {
  /**
   * @type array
   */
  agencies: Agency[];
};
export type FindAgenciesQuery = {
  Response: FindAgenciesQueryResponse;
  Errors: FindAgencies400 | FindAgencies500;
};
