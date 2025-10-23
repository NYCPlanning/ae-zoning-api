import type { CommunityBoardBudgetRequestAgencyCategoryResponse } from "./CommunityBoardBudgetRequestAgencyCategoryResponse";
import type { Error } from "./Error";

/**
 * @description An object containing a list of agency reponse categories
 */
export type FindCommunityBoardBudgetRequestAgencyCategoryResponses200 = {
  /**
   * @type array
   */
  cbbrAgencyCategoryResponses: CommunityBoardBudgetRequestAgencyCategoryResponse[];
};
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestAgencyCategoryResponses400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestAgencyCategoryResponses500 = Error;
/**
 * @description An object containing a list of agency reponse categories
 */
export type FindCommunityBoardBudgetRequestAgencyCategoryResponsesQueryResponse =
  {
    /**
     * @type array
     */
    cbbrAgencyCategoryResponses: CommunityBoardBudgetRequestAgencyCategoryResponse[];
  };
export type FindCommunityBoardBudgetRequestAgencyCategoryResponsesQuery = {
  Response: FindCommunityBoardBudgetRequestAgencyCategoryResponsesQueryResponse;
  Errors:
    | FindCommunityBoardBudgetRequestAgencyCategoryResponses400
    | FindCommunityBoardBudgetRequestAgencyCategoryResponses500;
};
