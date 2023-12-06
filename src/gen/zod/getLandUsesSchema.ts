import { z } from "zod";

import { landUseSchema } from "./landUseSchema";

/**
 * @description An array of land use objects.
 */
export const getLandUsesQueryResponseSchema = z.object({
  landUses: z.array(z.lazy(() => landUseSchema).schema).optional(),
});
