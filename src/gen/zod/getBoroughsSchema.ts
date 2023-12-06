import { z } from "zod";

import { boroughSchema } from "./boroughSchema";

/**
 * @description An array of borough objects.
 */
export const getBoroughsQueryResponseSchema = z.object({
  boroughs: z.array(z.lazy(() => boroughSchema).schema).optional(),
});
