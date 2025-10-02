import { z } from "zod";
import { agencySchema } from "./agencySchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing capital project managing agencies\n
 */
export const findCapitalProjectManagingAgencies200Schema = z.object({
  managingAgencies: z
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
export const findCapitalProjectManagingAgencies400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCapitalProjectManagingAgencies500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object containing capital project managing agencies\n
 */
export const findCapitalProjectManagingAgenciesQueryResponseSchema = z.object({
  managingAgencies: z
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
