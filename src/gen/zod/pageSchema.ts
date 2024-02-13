import { z } from "zod";

export const pageSchema = z.object({
  limit: z
    .number()
    .describe(
      `The limit used for the response. Defaults to 20 when the request does not specify one.`,
    )
    .min(1)
    .max(100),
  offset: z
    .number()
    .describe(
      `The offset used for the response. Defaults to 0 when the request does not specify one.`,
    )
    .min(0),
  total: z
    .number()
    .describe(
      `The number of rows returned in the response. If the total is less than the limit, the user is on the last page and no more results match the query.`,
    )
    .min(0),
  order: z
    .string()
    .describe(
      `The criteria used to sort the results. Defaults to the primary key of the table, ascending`,
    ),
});
