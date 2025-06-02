import type { CapitalProjectPage } from "./CapitalProjectPage";
import type { Error } from "./Error";

export type FindCapitalProjectsQueryParams = {
  /**
   * @description The three character numeric string containing the concatenation of the borough and community district ids.
   * @type string | undefined
   */
  communityDistrictId?: string;
  /**
   * @description One or two character code to represent city council districts.
   * @type string | undefined
   */
  cityCouncilDistrictId?: string;
  /**
   * @description The acronym of the managing agency to filter the projects by.
   * @type string | undefined
   */
  managingAgency?: string;
  /**
   * @description The two character alphabetic string containing the letters used to refer to the agency budget code.
   * @type string | undefined
   */
  agencyBudget?: string;
  /**
   * @description Minimum sum of total capital commitments to a given capital project, represented by USD amount, with cents and thousands separators both optional.
   * @type string | undefined
   */
  commitmentsTotalMin?: string;
  /**
   * @description Maximum sum of total capital commitments to a given capital project, represented by USD amount, with cents and thousands separators both optional.
   * @type string | undefined
   */
  commitmentsTotalMax?: string;
  /**
   * @description Used to filter whether a capital project has associated geographic coordinates.
   * @type boolean | undefined
   */
  isMapped?: boolean;
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
};
/**
 * @description An object containing pagination metadata and an array of capital projects
 */
export type FindCapitalProjects200 = CapitalProjectPage;
/**
 * @description Invalid client request
 */
export type FindCapitalProjects400 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjects500 = Error;
/**
 * @description An object containing pagination metadata and an array of capital projects
 */
export type FindCapitalProjectsQueryResponse = CapitalProjectPage;
export type FindCapitalProjectsQuery = {
  Response: FindCapitalProjectsQueryResponse;
  QueryParams: FindCapitalProjectsQueryParams;
  Errors: FindCapitalProjects400 | FindCapitalProjects500;
};
