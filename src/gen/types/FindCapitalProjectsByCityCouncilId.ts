import type { Error } from "./Error";
import type { CapitalProjectPage } from "./CapitalProjectPage";

export type FindCapitalProjectsByCityCouncilIdPathParams = {
  /**
   * @description One or two character code to represent city council districts.
   * @type string
   * @example 25
   */
  cityCouncilDistrictId: string;
};

export type FindCapitalProjectsByCityCouncilIdQueryParams = {
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type integer | undefined
   * @example 100
   */
  limit?: number;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type integer | undefined
   * @example 100
   */
  offset?: number;
};

export type FindCapitalProjectsByCityCouncilId400 = Error;

export type FindCapitalProjectsByCityCouncilId404 = Error;

export type FindCapitalProjectsByCityCouncilId500 = Error;

/**
 * @description An object containing pagination metadata and an array of capital projects for the city council district
 */
export type FindCapitalProjectsByCityCouncilIdQueryResponse =
  CapitalProjectPage;
