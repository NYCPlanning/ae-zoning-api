import { z } from "zod";
import { errorSchema } from "./errorSchema";

export const findCapitalProjectTilesByCityCouncilDistrictIdPathParamsSchema =
  z.object({
    cityCouncilDistrictId: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{1,2})$"))
      .describe(
        "One or two character code to represent city council districts.",
      ),
    z: z.coerce.number().describe("viewport zoom component"),
    x: z.coerce.number().describe("viewport x component"),
    y: z.coerce.number().describe("viewport y component"),
  });
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCapitalProjectTilesByCityCouncilDistrictId200Schema =
  z.coerce.string();
/**
 * @description Invalid client request
 */
export const findCapitalProjectTilesByCityCouncilDistrictId400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCapitalProjectTilesByCityCouncilDistrictId500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description A protobuf file formatted as Mapbox Vector Tile
 */
export const findCapitalProjectTilesByCityCouncilDistrictIdQueryResponseSchema =
  z.coerce.string();
