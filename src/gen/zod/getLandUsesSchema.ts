import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { landUseSchema } from "./landUseSchema";

export const getLandUses400Schema = z.lazy(() => errorSchema).schema;
export const getLandUses500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing all land uses.
 */
export const getLandUsesQueryResponseSchema = z.object({
  landUses: z.array(z.lazy(() => landUseSchema).schema),
});
