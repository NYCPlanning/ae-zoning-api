import { z } from "zod";
import { capitalProjectPageSchema } from "./capitalProjectPageSchema";
import { errorSchema } from "./errorSchema";

export const findCapitalProjectsQueryParamsSchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .describe(
        "The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.",
      )
      .optional(),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .describe(
        "The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.",
      )
      .optional(),
  })
  .optional();
/**
 * @description An object containing pagination metadata and an array of capital projects
 */
export const findCapitalProjects200Schema = z.lazy(
  () => capitalProjectPageSchema,
);
/**
 * @description Invalid client request
 */
export const findCapitalProjects400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCapitalProjects500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing pagination metadata and an array of capital projects
 */
export const findCapitalProjectsQueryResponseSchema = z.lazy(
  () => capitalProjectPageSchema,
);
