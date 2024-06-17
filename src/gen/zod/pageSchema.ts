import { z } from "zod";

export const pageSchema = z.object({
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .describe(
      "The limit used for the response. Defaults to 20 when the request does not specify one.",
    ),
  offset: z.coerce
    .number()
    .min(0)
    .describe(
      "The offset used for the response. Defaults to 0 when the request does not specify one.",
    ),
  total: z.coerce
    .number()
    .min(0)
    .describe(
      "The number of rows returned in the response. If the total is less than the limit, the user is on the last page and no more results match the query.",
    ),
  order: z.coerce
    .string()
    .describe(
      "The criteria used to sort the results. Defaults to the primary key of the table, ascending",
    ),
});
