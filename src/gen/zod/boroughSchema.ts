import { z } from "zod";

export const boroughSchema = z.object({
  id: z.coerce
    .string()
    .regex(new RegExp("^([0-9])$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
  title: z.coerce.string().describe("The full name of the borough."),
  abbr: z.coerce
    .string()
    .min(2)
    .max(2)
    .describe("The two character abbreviation for the borough."),
});
