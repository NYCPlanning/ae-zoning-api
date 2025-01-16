import type { CapitalProjectPage } from "./CapitalProjectPage";
import type { Error } from "./Error";

export type FindCapitalProjectsByCityCouncilIdPathParams = {
  /**
   * @description One or two character code to represent city council districts.
   * @type string
   */
  cityCouncilDistrictId: string;
};
export type FindCapitalProjectsByCityCouncilIdQueryParams = {
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type integer | undefined
   */
  limit?: number;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type integer | undefined
   */
  offset?: number;
  /**
   * @description The acronym of the managing agency to filter the projects by.
   * @type string | undefined
   */
  managingAgency?: string;
};
/**
 * @description An object containing pagination metadata and an array of capital projects for the city council district
 */
export type FindCapitalProjectsByCityCouncilId200 = CapitalProjectPage;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectsByCityCouncilId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCapitalProjectsByCityCouncilId404 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectsByCityCouncilId500 = Error;
/**
 * @description An object containing pagination metadata and an array of capital projects for the city council district
 */
export type FindCapitalProjectsByCityCouncilIdQueryResponse =
  CapitalProjectPage;
export type FindCapitalProjectsByCityCouncilIdQuery = {
  Response: FindCapitalProjectsByCityCouncilIdQueryResponse;
  PathParams: FindCapitalProjectsByCityCouncilIdPathParams;
  QueryParams: FindCapitalProjectsByCityCouncilIdQueryParams;
  Errors:
    | FindCapitalProjectsByCityCouncilId400
    | FindCapitalProjectsByCityCouncilId404
    | FindCapitalProjectsByCityCouncilId500;
};
