import { z } from "zod";
import { agencySchema } from "./agencySchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all agencies sorted alphabetically by the agency initials.\n
 */
export const findAgencies200Schema = z.object({
  agencies: z
    .array(z.lazy(() => agencySchema))
    .describe(
      "An list of agencies sorted alphabetically by the agency initials.\n",
    ),
  order: z.coerce
    .string()
    .describe(
      "The criteria used to sort the results using the agency initials in ascending order.",
    ),
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
 * @description An object containing all agencies sorted alphabetically by the agency initials.\n
 */
export const findAgenciesQueryResponseSchema = z.object({
  agencies: z
    .array(z.lazy(() => agencySchema))
    .describe(
      "An list of agencies sorted alphabetically by the agency initials.\n",
    ),
  order: z.coerce
    .string()
    .describe(
      "The criteria used to sort the results using the agency initials in ascending order.",
    ),
});
