import type { CommunityBoardBudgetRequestGeoJson } from "./CommunityBoardBudgetRequestGeoJson";
import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestGeoJsonByIdPathParams = {
  /**
   * @description The id for the community board budget request
   * @type string
   */
  cbbrId: string;
};
/**
 * @description A geojson object of community board budget request details
 */
export type FindCommunityBoardBudgetRequestGeoJsonById200 =
  CommunityBoardBudgetRequestGeoJson;
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestGeoJsonById400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCommunityBoardBudgetRequestGeoJsonById404 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestGeoJsonById500 = Error;
/**
 * @description A geojson object of community board budget request details
 */
export type FindCommunityBoardBudgetRequestGeoJsonByIdQueryResponse =
  CommunityBoardBudgetRequestGeoJson;
export type FindCommunityBoardBudgetRequestGeoJsonByIdQuery = {
  Response: FindCommunityBoardBudgetRequestGeoJsonByIdQueryResponse;
  PathParams: FindCommunityBoardBudgetRequestGeoJsonByIdPathParams;
  Errors:
    | FindCommunityBoardBudgetRequestGeoJsonById400
    | FindCommunityBoardBudgetRequestGeoJsonById404
    | FindCommunityBoardBudgetRequestGeoJsonById500;
};
