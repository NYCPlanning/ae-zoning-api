import { z } from "zod";
import { errorSchema } from "./errorSchema";

export const findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdPathParamsSchema =
  z.object({
    boroughId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1})$"))
      .describe(
        "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
      ),
    communityDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{2})$"))
      .describe(
        "The two character numeric string containing the number used to refer to the community district.",
      ),
    z: z.coerce.number().int().describe("viewport zoom component"),
    x: z.coerce.number().int().describe("viewport x component"),
    y: z.coerce.number().int().describe("viewport y component"),
  });
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId200Schema =
  z.coerce.string();
/**
 * @description Invalid client request
 */
export const findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId500Schema =
  z.lazy(() => errorSchema);
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdQueryResponseSchema =
  z.coerce.string();
