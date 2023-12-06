import { z } from "zod";

export const boroughSchema = z.object({
  id: z
    .string()
    .describe(
      `A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.`,
    )
    .regex(new RegExp("\\b[1-9]\\b")),
  title: z.string().describe(`The full name of the borough.`),
  abbr: z
    .string()
    .describe(`The two character abbreviation for the borough.`)
    .min(2)
    .max(2),
});
