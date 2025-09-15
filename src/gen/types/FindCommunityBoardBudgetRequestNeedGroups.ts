import type { CommunityBoardBudgetRequestNeedGroup } from "./CommunityBoardBudgetRequestNeedGroup";
import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestNeedGroupsQueryParams = {
  /**
   * @description The number used to refer to the policy area.
   * @type integer | undefined
   */
  cbbrPolicyAreaId?: number;
  /**
   * @description A string of variable length containing the initials of the agency.
   * @type string | undefined
   */
  agencyInitials?: string;
};
/**
 * @description An object containing a list of need groups
 */
export type FindCommunityBoardBudgetRequestNeedGroups200 = {
  /**
   * @type array
   */
  cbbrNeedGroups: CommunityBoardBudgetRequestNeedGroup[];
};
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestNeedGroups400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestNeedGroups500 = Error;
/**
 * @description An object containing a list of need groups
 */
export type FindCommunityBoardBudgetRequestNeedGroupsQueryResponse = {
  /**
   * @type array
   */
  cbbrNeedGroups: CommunityBoardBudgetRequestNeedGroup[];
};
export type FindCommunityBoardBudgetRequestNeedGroupsQuery = {
  Response: FindCommunityBoardBudgetRequestNeedGroupsQueryResponse;
  QueryParams: FindCommunityBoardBudgetRequestNeedGroupsQueryParams;
  Errors:
    | FindCommunityBoardBudgetRequestNeedGroups400
    | FindCommunityBoardBudgetRequestNeedGroups500;
};
