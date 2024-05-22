import type { Error } from "./Error";
import type { Agency } from "./Agency";

export type FindAgencies400 = Error;

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
