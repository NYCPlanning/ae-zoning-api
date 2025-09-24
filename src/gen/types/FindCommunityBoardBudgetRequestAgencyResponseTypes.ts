import type { CommunityBoardBudgetRequestAgencyResponseType } from "./CommunityBoardBudgetRequestAgencyResponseType";
import type { Error } from "./Error";

/**
 * @description An object containing a list of agency reponse types
 */
export type FindCommunityBoardBudgetRequestAgencyResponseTypes200 = {
  /**
   * @type array
   */
  cbbrAgencyResponseTypes: CommunityBoardBudgetRequestAgencyResponseType[];
};
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestAgencyResponseTypes400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestAgencyResponseTypes500 = Error;
/**
 * @description An object containing a list of agency reponse types
 */
export type FindCommunityBoardBudgetRequestAgencyResponseTypesQueryResponse = {
  /**
   * @type array
   */
  cbbrAgencyResponseTypes: CommunityBoardBudgetRequestAgencyResponseType[];
};
export type FindCommunityBoardBudgetRequestAgencyResponseTypesQuery = {
  Response: FindCommunityBoardBudgetRequestAgencyResponseTypesQueryResponse;
  Errors:
    | FindCommunityBoardBudgetRequestAgencyResponseTypes400
    | FindCommunityBoardBudgetRequestAgencyResponseTypes500;
};
