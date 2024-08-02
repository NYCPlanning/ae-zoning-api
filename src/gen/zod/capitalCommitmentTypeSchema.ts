import { z } from "zod";

export const capitalCommitmentTypeSchema = z.object({
  code: z.coerce
    .string()
    .min(4)
    .max(4)
    .describe(
      "The four character code to represent the capital commitment type",
    ),
  description: z.coerce
    .string()
    .describe("The description of the capital commitment type."),
});
