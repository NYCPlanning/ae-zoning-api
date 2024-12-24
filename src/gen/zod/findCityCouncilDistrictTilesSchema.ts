import { z } from "zod";
import { errorSchema } from "./errorSchema";

export const findCityCouncilDistrictTilesPathParamsSchema = z.object({
  z: z.coerce.number().int().describe("viewport zoom component"),
  x: z.coerce.number().int().describe("viewport x component"),
  y: z.coerce.number().int().describe("viewport y component"),
});
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCityCouncilDistrictTiles200Schema = z.coerce.string();
/**
 * @description Invalid client request
 */
export const findCityCouncilDistrictTiles400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCityCouncilDistrictTiles500Schema = z.lazy(() => errorSchema);
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCityCouncilDistrictTilesQueryResponseSchema =
  z.coerce.string();
