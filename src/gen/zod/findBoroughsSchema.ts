import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { boroughSchema } from "./boroughSchema";

export const findBoroughs400Schema = z.lazy(() => errorSchema).schema;
export const findBoroughs500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing all boroughs.
 */
export const findBoroughsQueryResponseSchema = z.object({
  boroughs: z.array(z.lazy(() => boroughSchema).schema),
});
