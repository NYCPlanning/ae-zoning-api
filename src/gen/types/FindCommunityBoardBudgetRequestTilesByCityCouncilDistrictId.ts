import type { Error } from "./Error";

export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdPathParams =
  {
    /**
     * @description One or two character code to represent city council districts.
     * @type string
     */
    cityCouncilDistrictId: string;
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
export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictId200 =
  string;
/**
 * @description Invalid client request
 */
export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictId400 =
  Error;
/**
 * @description Server side error
 */
export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictId500 =
  Error;
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdQueryResponse =
  string;
export type FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdQuery = {
  Response: FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdQueryResponse;
  PathParams: FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdPathParams;
  Errors:
    | FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictId400
    | FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictId500;
};
