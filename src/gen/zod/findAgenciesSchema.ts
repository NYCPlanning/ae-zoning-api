import { z } from "zod";
import { agencySchema } from "./agencySchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all agencies.
 */
export const findAgencies200Schema = z.object({
  agencies: z.array(z.lazy(() => agencySchema)),
});
/**
 * @description Invalid client request
 */
export const findAgencies400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findAgencies500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing all agencies.
 */
export const findAgenciesQueryResponseSchema = z.object({
  agencies: z.array(z.lazy(() => agencySchema)),
});
