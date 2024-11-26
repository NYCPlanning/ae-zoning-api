import { z } from "zod";
import { errorSchema } from "./errorSchema";

export const findCapitalProjectTilesPathParamsSchema = z.object({
  z: z.coerce.number().int().describe("viewport zoom component"),
  x: z.coerce.number().int().describe("viewport x component"),
  y: z.coerce.number().int().describe("viewport y component"),
});
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCapitalProjectTiles200Schema = z.coerce.string();
/**
 * @description Invalid client request
 */
export const findCapitalProjectTiles400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCapitalProjectTiles500Schema = z.lazy(() => errorSchema);
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCapitalProjectTilesQueryResponseSchema = z.coerce.string();
