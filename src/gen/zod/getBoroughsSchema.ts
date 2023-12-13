import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { boroughSchema } from "./boroughSchema";

export const getBoroughs400Schema = z.lazy(() => errorSchema).schema;
export const getBoroughs500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing all boroughs.
 */
export const getBoroughsQueryResponseSchema = z.object({
  boroughs: z.array(z.lazy(() => boroughSchema).schema),
});
