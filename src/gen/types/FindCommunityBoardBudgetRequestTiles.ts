import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestTilesPathParams = {
  /**
   * @description viewport zoom component
   * @type integer
   */
  z: number;
  /**
   * @description viewport x component
   * @type integer
   */
  x: number;
  /**
   * @description viewport y component
   * @type integer
   */
  y: number;
};
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCommunityBoardBudgetRequestTiles200 = string;
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestTiles400 = Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestTiles500 = Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCommunityBoardBudgetRequestTilesQueryResponse = string;
export type FindCommunityBoardBudgetRequestTilesQuery = {
  Response: FindCommunityBoardBudgetRequestTilesQueryResponse;
  PathParams: FindCommunityBoardBudgetRequestTilesPathParams;
  Errors:
    | FindCommunityBoardBudgetRequestTiles400
    | FindCommunityBoardBudgetRequestTiles500;
};
