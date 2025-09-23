import { z } from "zod";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestTilesPathParamsSchema = z.object({
  z: z.coerce.number().int().describe("viewport zoom component"),
  x: z.coerce.number().int().describe("viewport x component"),
  y: z.coerce.number().int().describe("viewport y component"),
});
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCommunityBoardBudgetRequestTiles200Schema = z.coerce.string();
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestTiles400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestTiles500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCommunityBoardBudgetRequestTilesQueryResponseSchema =
  z.coerce.string();
