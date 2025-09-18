import type { CommunityBoardBudgetRequest } from "./CommunityBoardBudgetRequest";
import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestByIdPathParams = {
  /**
   * @description The id for the community board budget request
   * @type string
   */
  cbbrId: string;
};
/**
 * @description An object of community board budget request details
 */
export type FindCommunityBoardBudgetRequestById200 =
  CommunityBoardBudgetRequest;
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestById400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCommunityBoardBudgetRequestById404 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestById500 = Error;
/**
 * @description An object of community board budget request details
 */
export type FindCommunityBoardBudgetRequestByIdQueryResponse =
  CommunityBoardBudgetRequest;
export type FindCommunityBoardBudgetRequestByIdQuery = {
  Response: FindCommunityBoardBudgetRequestByIdQueryResponse;
  PathParams: FindCommunityBoardBudgetRequestByIdPathParams;
  Errors:
    | FindCommunityBoardBudgetRequestById400
    | FindCommunityBoardBudgetRequestById404
    | FindCommunityBoardBudgetRequestById500;
};
