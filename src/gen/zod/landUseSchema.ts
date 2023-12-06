import { z } from "zod";

export const landUseSchema = z.object({
  id: z
    .string()
    .describe(
      `The two character code to represent the land use. Possible values are 01-11.`,
    )
    .min(2)
    .max(2),
  description: z.string().describe(`The description of the land use.`),
  color: z
    .string()
    .describe(`Hex-style color code to represent the land use.`)
    .regex(new RegExp("^#([A-Fa-f0-9]{8})$")),
});
