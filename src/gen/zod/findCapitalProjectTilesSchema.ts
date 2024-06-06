import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const findCapitalProjectTilesPathParamsSchema = z.object({
  z: z.number().describe(`viewport zoom component`),
  x: z.number().describe(`viewport x component`),
  y: z.number().describe(`viewport y component`),
});
export const findCapitalProjectTilesQueryResponseSchema = z.any();
export const findCapitalProjectTiles400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCapitalProjectTiles500Schema = z.lazy(
  () => errorSchema,
).schema;
