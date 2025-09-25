import type { CommunityBoardBudgetRequestPage } from "./CommunityBoardBudgetRequestPage";
import type { Error } from "./Error";

export const findCommunityBoardBudgetRequestsQueryParamsCbbrType = {
  C: "C",
  E: "E",
} as const;
export type FindCommunityBoardBudgetRequestsQueryParamsCbbrType =
  (typeof findCommunityBoardBudgetRequestsQueryParamsCbbrType)[keyof typeof findCommunityBoardBudgetRequestsQueryParamsCbbrType];
export type FindCommunityBoardBudgetRequestsQueryParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string | undefined
   */
  boroughId?: string;
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
   * @description The number used to refer to the policy area.
   * @type integer | undefined
   */
  cbbrPolicyAreaId?: number;
  /**
   * @description The number used to refer to the need group.
   * @type integer | undefined
   */
  cbbrNeedGroupId?: number;
  /**
   * @description A string of variable length containing the initials of the agency.
   * @type string | undefined
   */
  agencyInitials?: string;
  /**
   * @description The type of budget request, C for Capital, or E for Expense.
   * @type string | undefined
   */
  cbbrType?: FindCommunityBoardBudgetRequestsQueryParamsCbbrType;
  /**
   * @description An array containing the IDs of the agency response types of the Community Board Budget Requests.
   * @type array | undefined
   */
  cbbrAgencyResponseTypeId?: number[];
  /**
   * @description Used to filter whether a capital project or community board budget request has associated geographic coordinates.
   * @type boolean | undefined
   */
  isMapped?: boolean;
  /**
   * @description Used to filter whether a community board budget request is for Continued Support. Note: All Continued Support requests are of the \"Capital\" cbbrType.
   * @type boolean | undefined
   */
  isContinuedSupport?: boolean;
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
 * @description An object containing pagination metadata and an array of community board budget requests
 */
export type FindCommunityBoardBudgetRequests200 =
  CommunityBoardBudgetRequestPage;
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequests400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCommunityBoardBudgetRequests404 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequests500 = Error;
/**
 * @description An object containing pagination metadata and an array of community board budget requests
 */
export type FindCommunityBoardBudgetRequestsQueryResponse =
  CommunityBoardBudgetRequestPage;
export type FindCommunityBoardBudgetRequestsQuery = {
  Response: FindCommunityBoardBudgetRequestsQueryResponse;
  QueryParams: FindCommunityBoardBudgetRequestsQueryParams;
  Errors:
    | FindCommunityBoardBudgetRequests400
    | FindCommunityBoardBudgetRequests404
    | FindCommunityBoardBudgetRequests500;
};
