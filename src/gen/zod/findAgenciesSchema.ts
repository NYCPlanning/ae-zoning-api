import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { agencySchema } from "./agencySchema";

export const findAgencies400Schema = z.lazy(() => errorSchema).schema;
export const findAgencies500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing all agencies.
 */
export const findAgenciesQueryResponseSchema = z.object({
  agencies: z.array(z.lazy(() => agencySchema).schema),
});
