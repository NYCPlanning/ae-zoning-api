import type { CommunityBoardBudgetRequestPolicyArea } from "./CommunityBoardBudgetRequestPolicyArea";
import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestPolicyAreasQueryParams = {
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
};
/**
 * @description An object containing a list of policy areas
 */
export type FindCommunityBoardBudgetRequestPolicyAreas200 = {
  /**
   * @type array
   */
  cbbrPolicyAreas: CommunityBoardBudgetRequestPolicyArea[];
};
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestPolicyAreas400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestPolicyAreas500 = Error;
/**
 * @description An object containing a list of policy areas
 */
export type FindCommunityBoardBudgetRequestPolicyAreasQueryResponse = {
  /**
   * @type array
   */
  cbbrPolicyAreas: CommunityBoardBudgetRequestPolicyArea[];
};
export type FindCommunityBoardBudgetRequestPolicyAreasQuery = {
  Response: FindCommunityBoardBudgetRequestPolicyAreasQueryResponse;
  QueryParams: FindCommunityBoardBudgetRequestPolicyAreasQueryParams;
  Errors:
    | FindCommunityBoardBudgetRequestPolicyAreas400
    | FindCommunityBoardBudgetRequestPolicyAreas500;
};
