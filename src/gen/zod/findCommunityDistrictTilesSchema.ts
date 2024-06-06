import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const findCommunityDistrictTilesPathParamsSchema = z.object({
  z: z.number().describe(`viewport zoom component`),
  x: z.number().describe(`viewport x component`),
  y: z.number().describe(`viewport y component`),
});
export const findCommunityDistrictTilesQueryResponseSchema = z.any();
export const findCommunityDistrictTiles400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCommunityDistrictTiles500Schema = z.lazy(
  () => errorSchema,
).schema;
