import type { Agency } from "./Agency";
import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestAgenciesQueryParams = {
  /**
   * @description The number used to refer to the need group.
   * @type integer | undefined
   */
  cbbrNeedGroupId?: number;
  /**
   * @description The number used to refer to the policy area.
   * @type integer | undefined
   */
  cbbrPolicyAreaId?: number;
};
/**
 * @description An object containing a list of agencies
 */
export type FindCommunityBoardBudgetRequestAgencies200 = {
  /**
   * @type array
   */
  cbbrAgencies: Agency[];
};
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestAgencies400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestAgencies500 = Error;
/**
 * @description An object containing a list of agencies
 */
export type FindCommunityBoardBudgetRequestAgenciesQueryResponse = {
  /**
   * @type array
   */
  cbbrAgencies: Agency[];
};
export type FindCommunityBoardBudgetRequestAgenciesQuery = {
  Response: FindCommunityBoardBudgetRequestAgenciesQueryResponse;
  QueryParams: FindCommunityBoardBudgetRequestAgenciesQueryParams;
  Errors:
    | FindCommunityBoardBudgetRequestAgencies400
    | FindCommunityBoardBudgetRequestAgencies500;
};
