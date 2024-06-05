import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const findCityCouncilDistrictTilesPathParamsSchema = z.object({
  z: z.number().describe(`viewport zoom component`),
  x: z.number().describe(`viewport x component`),
  y: z.number().describe(`viewport y component`),
});
export const findCityCouncilDistrictTilesQueryResponseSchema = z.any();
export const findCityCouncilDistrictTiles400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCityCouncilDistrictTiles500Schema = z.lazy(
  () => errorSchema,
).schema;
