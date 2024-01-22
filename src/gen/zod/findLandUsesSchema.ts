import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { landUseSchema } from "./landUseSchema";

export const findLandUses400Schema = z.lazy(() => errorSchema).schema;
export const findLandUses500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing all land uses.
 */
export const findLandUsesQueryResponseSchema = z.object({
  landUses: z.array(z.lazy(() => landUseSchema).schema),
});
